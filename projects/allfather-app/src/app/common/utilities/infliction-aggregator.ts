import { cleanInt, isEmpty } from "common/utilities/";
import { addMilliseconds } from "date-fns";
import { merge, Observable, ObservableInput } from "rxjs";
import { debounceTime, filter, groupBy, map, mergeMap, share, tap } from "rxjs/operators";
import { MatchInflictionEvent, MatchInflictionEventAccum } from "../match/infliction-event";
import { isPlayerNameEqual } from "./player";

export class InflictionAggregator {
    public get expireAggregateMs(): number {
        return this._expireAggregateMs;
    }
    public get emitOnExpire(): boolean {
        return this._emitOnExpire;
    }

    private accumulations: MatchInflictionEventAccum[] = [];

    private _expireAggregateMs: number;
    private _emitOnExpire: boolean;

    /**
     * Creates a stream of aggregated damage and/or killfeed events for the local player (accumulated per victim).
     * @param {number} config.expireAggregateMs Expire and reset victims' aggregated value.
     * @param {boolean} config.emitOnExpire Emit the resetted values.
     */
    constructor({ expireAggregateMs, emitOnExpire }: { expireAggregateMs: number; emitOnExpire?: boolean }) {
        this._expireAggregateMs = expireAggregateMs;
        this._emitOnExpire = emitOnExpire ?? false;
    }

    public getInflictionAggregate$(damageEventObservables: ObservableInput<MatchInflictionEvent>[]): Observable<MatchInflictionEventAccum> {
        const inflictionEventObs$ = merge(...damageEventObservables).pipe(
            map((inflEvent) => this.convertToAggregateInflictionEvent(inflEvent)),
            map((inflEvent) => ({ ...inflEvent, latestTimestamp: new Date() } as MatchInflictionEventAccum)),
            filter((inflEvent) => !isEmpty(inflEvent.victim?.name)),
            share()
        );

        return merge(this.createAggregateEventObs$(inflictionEventObs$), this.createResetEventObs$(inflictionEventObs$));
    }

    public clearAccumulations(): void {
        this.accumulations = [];
    }

    private createAggregateEventObs$(inflictionEventObs: Observable<MatchInflictionEventAccum>): Observable<MatchInflictionEventAccum> {
        return inflictionEventObs.pipe(
            map((inflEvent) => {
                const foundVictim = this.findVictimAccumulation(inflEvent.victim?.name);
                const victimTimedOut = new Date() >= addMilliseconds(foundVictim?.latestTimestamp ?? 0, this._expireAggregateMs);
                const accumInflEvent =
                    !foundVictim || victimTimedOut ? this.handleNewVictimInfl(inflEvent) : this.handleExistingVictimInfl(inflEvent);
                return accumInflEvent;
            })
        );
    }

    private createResetEventObs$(inflictionEventObs: Observable<MatchInflictionEventAccum>): Observable<MatchInflictionEventAccum> {
        const isExpired = (event: MatchInflictionEventAccum): boolean => {
            const existingVictim = this.findVictimAccumulation(event.victim?.name);
            const timestampExists = !!existingVictim?.latestTimestamp;
            const timestampExpired = new Date() >= addMilliseconds(existingVictim?.latestTimestamp ?? 0, this._expireAggregateMs);
            return !!existingVictim && timestampExists && timestampExpired;
        };

        return inflictionEventObs.pipe(
            filter(() => !!this._emitOnExpire),
            groupBy((inflEvent) => inflEvent.victim?.name),
            mergeMap((victimName$) =>
                victimName$.pipe(
                    debounceTime(this.expireAggregateMs),
                    map((event) => {
                        return {
                            victim: event.victim,
                            shieldDamageSum: 0,
                            healthDamageSum: 0,
                            hasShield: true,
                            isKnocked: false,
                            isEliminated: false,
                            latestAttacker: undefined,
                            latestTimestamp: undefined,
                        } as MatchInflictionEventAccum;
                    }),
                    filter((event) => isExpired(event)), // Check that an event has been received within the debounce window
                    tap((event) => (this.accumulations = this.victimFilteredAccumulations(event.victim?.name)))
                )
            )
        );
    }

    /**
     * Brand-new victim, or victim's accumulation amounts has expired
     * @overwolfQuirk Overwolf incorrectly sets "armor" to "false" when inflicting any damage of 50 or greater.
     *                As a workaround, manually set "armor" to "true" on initial aggregated inflictions of 50 or greater. (causes some inaccuracies)
     */
    private handleNewVictimInfl(inflEvent: MatchInflictionEventAccum): MatchInflictionEventAccum {
        // @overwolfQuirk
        if (!inflEvent.isKnocked && !inflEvent.isEliminated && !inflEvent.hasShield && inflEvent.healthDamageSum >= 50) {
            inflEvent.shieldDamageSum = inflEvent.healthDamageSum;
            inflEvent.healthDamageSum = 0;
            inflEvent.hasShield = true;
        }

        const updatedVictimAccum = this.mergeInflictionEvents(inflEvent);
        // Remove existing expired accumulation amounts and add new infliction event
        this.accumulations = [...this.victimFilteredAccumulations(inflEvent.victim?.name), updatedVictimAccum];
        return updatedVictimAccum;
    }

    private handleExistingVictimInfl(inflEvent: MatchInflictionEventAccum): MatchInflictionEventAccum {
        const existingVictimAccum = this.findVictimAccumulation(inflEvent.victim?.name);
        const updatedVictimAccum = this.mergeInflictionEvents(inflEvent, existingVictimAccum);
        // Remove existing expired accumulation amounts and add updated infliction amounts
        this.accumulations = [...this.victimFilteredAccumulations(inflEvent.victim?.name), updatedVictimAccum];
        return updatedVictimAccum;
    }

    private mergeInflictionEvents(
        newInflictionEvent: MatchInflictionEventAccum,
        existingInflictionEvent?: MatchInflictionEventAccum
    ): MatchInflictionEventAccum {
        const mergedInflictionEvent: MatchInflictionEventAccum = {
            victim: existingInflictionEvent?.victim || newInflictionEvent.victim,
            isKnocked: !!existingInflictionEvent?.isKnocked || !!newInflictionEvent.isKnocked,
            isEliminated: !!existingInflictionEvent?.isEliminated || !!newInflictionEvent.isEliminated,
            shieldDamageSum: cleanInt(existingInflictionEvent?.shieldDamageSum) + cleanInt(newInflictionEvent.shieldDamageSum),
            healthDamageSum: cleanInt(existingInflictionEvent?.healthDamageSum) + cleanInt(newInflictionEvent.healthDamageSum),
            hasShield: !!newInflictionEvent.hasShield,
            latestAttacker: newInflictionEvent.latestAttacker || existingInflictionEvent?.latestAttacker || undefined,
            latestTimestamp: newInflictionEvent.latestTimestamp || existingInflictionEvent?.latestTimestamp || new Date(),
        };
        return mergedInflictionEvent;
    }

    private findVictimAccumulation(victimName?: string): Optional<MatchInflictionEventAccum> {
        if (isEmpty(victimName)) return undefined;
        const foundVictimAccum = this.accumulations.find((a) => isPlayerNameEqual(a.victim?.name, victimName));
        return foundVictimAccum;
    }

    private victimFilteredAccumulations(victimName?: string): MatchInflictionEventAccum[] {
        if (isEmpty(victimName)) return this.accumulations;
        const victimFilteredAccums = this.accumulations.filter((a) => !isPlayerNameEqual(a.victim?.name, victimName));
        return victimFilteredAccums;
    }

    /**
     * Used ONLY to convert properties of MatchInflictionEvent to InflictionAggregateEvent.
     * Does NOT make assumptions about default values, ie. undefined into false. That is the role of the accumulator function.
     */
    private convertToAggregateInflictionEvent(matchInflictionEvent: MatchInflictionEvent): MatchInflictionEventAccum {
        return {
            victim: matchInflictionEvent.victim,
            shieldDamageSum: matchInflictionEvent.shieldDamage!,
            healthDamageSum: matchInflictionEvent.healthDamage!,
            hasShield: matchInflictionEvent.hasShield!,
            isKnocked: matchInflictionEvent.isKnockdown!,
            isEliminated: matchInflictionEvent.isElimination!,
            latestAttacker: matchInflictionEvent.attacker,
            latestTimestamp: matchInflictionEvent.timestamp,
        };
    }
}
