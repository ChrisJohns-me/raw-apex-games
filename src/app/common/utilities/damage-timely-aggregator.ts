import { addMilliseconds } from "date-fns";
import { merge, Observable, ObservableInput, throwError } from "rxjs";
import { debounceTime, distinct, filter, map, mergeMap, scan, startWith } from "rxjs/operators";
import { cleanInt } from "src/utilities";
import { MatchDamageEvent } from "../match/match-damage-event";
import { getPlayerNameClubParts, isPlayerNameEqual } from "./player";

const seedDamageEvent: MatchDamageEvent = {
    timestamp: undefined!,
    victim: undefined!,
    attacker: undefined,
    hasShield: false,
    isHeadshot: undefined,
    shieldDamage: 0,
    healthDamage: 0,
    isKnockdown: false,
    isElimination: false,
};

type DamageAggregateEvent = MatchDamageEvent & { _aggregateExpiration?: Date };

export class DamageTimelyAggregator {
    private mergedDamageEventObs$?: Observable<MatchDamageEvent>;
    private expireAggregateMs: number;
    private emitOnExpire: boolean;

    /**
     * Creates a stream of aggregated damage and/or killfeed events for the local player (accumulated per victim).
     * @param {number} config.expireAggregateMs Expire and reset victims' aggregated value.
     * @param {boolean} config.emitOnExpire Emit the resetted values.
     */
    constructor({ expireAggregateMs, emitOnExpire }: { expireAggregateMs: number; emitOnExpire?: boolean }) {
        this.expireAggregateMs = expireAggregateMs;
        this.emitOnExpire = emitOnExpire ?? false;
    }

    public getDamageAggregate$(damageEventObservables: ObservableInput<MatchDamageEvent>[]): Observable<MatchDamageEvent> {
        this.mergedDamageEventObs$ = merge(...damageEventObservables);

        const distinctFlush$ = this.mergedDamageEventObs$.pipe(debounceTime(this.expireAggregateMs * 2));
        const distinctVictimDamageEvent$ = this.mergedDamageEventObs$.pipe(
            distinct((dmgEvent) => getPlayerNameClubParts(dmgEvent.victim.name)[1], distinctFlush$),
            mergeMap((dmgEvent) => this.createVictimDamageStream$(dmgEvent))
        );

        return merge(distinctVictimDamageEvent$, distinctFlush$);
    }

    private createVictimDamageStream$(initialDamageEvent: MatchDamageEvent): Observable<MatchDamageEvent> {
        if (!this.mergedDamageEventObs$) return throwError("Error: Merged Observable not set.");

        const victimDamageEvent$ = this.mergedDamageEventObs$.pipe(
            startWith(initialDamageEvent),
            filter((dmgEvent) => isPlayerNameEqual(dmgEvent.victim.name, initialDamageEvent.victim.name))
        );

        const accumulatedDamageEvent$ = victimDamageEvent$.pipe(
            scan((acc, curr) => this.damageEventTimedAccumFn(acc, curr), seedDamageEvent)
        );

        const expirationEmitEvent$ = victimDamageEvent$.pipe(
            // Emit reset events
            debounceTime(this.emitOnExpire ? this.expireAggregateMs : 0),
            map((aggDmgEvent) => ({ ...seedDamageEvent, timestamp: new Date(), victim: aggDmgEvent.victim }))
        );

        return merge(accumulatedDamageEvent$, expirationEmitEvent$);
    }

    private damageEventTimedAccumFn(acc: DamageAggregateEvent, curr: MatchDamageEvent): DamageAggregateEvent {
        if (acc._aggregateExpiration && curr.timestamp > acc._aggregateExpiration) acc = seedDamageEvent;
        const newEvent: DamageAggregateEvent = { ...curr };
        newEvent.isHeadshot = undefined;
        // Retain knockdown & elimination values until expiration
        newEvent.isKnockdown = !!acc.isKnockdown || !!curr.isKnockdown;
        newEvent.isElimination = !!acc.isElimination || !!curr.isElimination;
        newEvent.shieldDamage = cleanInt(acc.shieldDamage) + cleanInt(curr.shieldDamage);
        newEvent.healthDamage = cleanInt(acc.healthDamage) + cleanInt(curr.healthDamage);
        newEvent.hasShield = !!curr.hasShield;
        newEvent._aggregateExpiration = addMilliseconds(new Date(), this.expireAggregateMs);

        return newEvent;
    }
}
