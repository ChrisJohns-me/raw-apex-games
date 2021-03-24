import { Injectable, OnDestroy } from "@angular/core";
import { WeaponItem } from "@common/items/weapon-item";
import { MatchDamageEvent } from "@common/match/match-damage-event";
import { differenceInMilliseconds } from "date-fns";
import { BehaviorSubject, Subject } from "rxjs";
import { delay, filter, map, takeUntil } from "rxjs/operators";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { MatchRosterService } from "./match-roster.service";
import { MatchService } from "./match.service";
import { OverwolfDataProviderService, OWGameEventKillFeed } from "./overwolf-data-provider";
import { PlayerService } from "./player.service";

const KILLFEED_SECONDARY_DELAY = 1000; // Should be larger than `KILLFEED_UNIQUE_TIMEFRAME`
const KILLFEED_UNIQUE_TIMEFRAME = 3000; // Prevents duplicates from Primary & Secondary source within this timeframe

/**
 * @classdesc Provides all killfeed events.
 */
@Injectable({
    providedIn: "root",
    deps: [MatchService, MatchRosterService, OverwolfDataProviderService, PlayerService],
    useFactory: (...deps: unknown[]) =>
        SingletonServiceProviderFactory("MatchActivityService", MatchActivityService, deps),
})
export class MatchActivityService implements OnDestroy {
    public readonly killfeedEvent$ = new Subject<MatchDamageEvent>();
    public readonly killfeedEventHistory$ = new BehaviorSubject<MatchDamageEvent[]>([]);

    private readonly _unsubscribe = new Subject<void>();

    constructor(
        private readonly match: MatchService,
        private readonly matchRoster: MatchRosterService,
        private readonly overwolf: OverwolfDataProviderService,
        private readonly player: PlayerService
    ) {}

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public start(): void {
        this.setupMatchReset();
        this.setupKillfeed();
        this.setupKillsAndKnockdowns();
    }

    /**
     * Reset state on match start
     */
    private setupMatchReset(): void {
        this.match.startedEvent$.pipe(takeUntil(this._unsubscribe)).subscribe(() => {
            this.killfeedEventHistory$.next([]);
        });
    }

    /**
     * Primary source of killfeed events.
     * From the gameEvent name: "kill_feed"
     */
    private setupKillfeed(): void {
        this.overwolf.newGameEvent$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((gameEvent) => gameEvent.name === "kill_feed"),
                map((gameEvent) => gameEvent.data as OWGameEventKillFeed)
            )
            .subscribe((killfeed) => {
                const victim = this.matchRoster.matchRoster$.value.findPlayer(killfeed.victimName);
                const attacker = this.matchRoster.matchRoster$.value.findPlayer(killfeed.attackerName);
                const weapon = new WeaponItem({ fromInGameEventName: killfeed.weaponName });
                const action = killfeed.action;
                const isVictimKnocked = !!(action === "Melee" || action === "Caustic Gas" || action === "knockdown");
                const isVictimEliminated = !!(
                    action === "Bleed Out" ||
                    action === "kill" ||
                    action === "headshot_kill"
                );
                if (!victim) return;

                const newMatchDamageEvent: MatchDamageEvent = {
                    timestamp: new Date(),
                    victim: victim,
                    attacker: attacker,
                    isKnockdown: isVictimKnocked,
                    isElimination: isVictimEliminated,
                    weapon,
                };

                this.addUniqueKillfeedEvent(newMatchDamageEvent);
            });
    }

    /**
     * Secondary source of killfeed events.
     * From the gameEvent name: "kill", "knockdown".
     * This event is used as a backup if the primary does not emit.
     * However, this event provides less information about the action; therefore it is
     *  delayed to attempt to use the primary source if possible.
     */
    private setupKillsAndKnockdowns(): void {
        type KillOrKnockdownData = overwolf.gep.ApexLegends.GameEventKill | overwolf.gep.ApexLegends.GameEventKnockdown;

        this.overwolf.newGameEvent$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((gameEvent) => gameEvent.name === "knockdown" || gameEvent.name === "kill"),
                filter((gameEvent) => !!gameEvent.data && typeof gameEvent.data === "object"),
                filter((gameEvent) => !!(gameEvent.data as KillOrKnockdownData).victimName),
                delay(KILLFEED_SECONDARY_DELAY)
            )
            .subscribe((gameEvent) => {
                if (!this.player.me$.value.name) return;
                const actionData = gameEvent.data as KillOrKnockdownData;
                const victim = this.matchRoster.matchRoster$.value.findPlayer(actionData.victimName);
                const attacker = this.matchRoster.matchRoster$.value.findPlayer(this.player.me$.value.name);
                const weapon = new WeaponItem({});
                const isVictimKnocked = gameEvent.name === "knockdown";
                const isVictimEliminated = gameEvent.name === "kill";
                if (!victim) return;

                const newMatchDamageEvent: MatchDamageEvent = {
                    timestamp: new Date(),
                    victim: victim,
                    attacker: attacker,
                    isKnockdown: isVictimKnocked,
                    isElimination: isVictimEliminated,
                    weapon,
                };
                if (this.addUniqueKillfeedEvent(newMatchDamageEvent)) {
                    console.warn(
                        `"${gameEvent.name}" killfeed action was not emitted by primary source (name: kill_feed);` +
                            ` but was found in secondary source (name: ${gameEvent.name}).`,
                        newMatchDamageEvent
                    );
                }
            });
    }

    /**
     * Adds unique killfeed events to the history, and emits a killfeed event.
     * @returns {boolean} true if the item is unique.
     */
    private addUniqueKillfeedEvent(damageEvent: MatchDamageEvent): boolean {
        const foundEvent = this.killfeedEventHistory$.value.find((kf) => {
            const sameVictim = kf.victim === damageEvent.victim;
            const sameAttacker = kf.attacker === damageEvent.attacker;
            const sameKnockdown = kf.isKnockdown === damageEvent.isKnockdown;
            const sameElimination = kf.isElimination === damageEvent.isElimination;
            const nullHeadshot = kf.isHeadshot == null && damageEvent.isHeadshot == null;
            const nullShieldDamage = kf.shieldDamage == null && damageEvent.shieldDamage == null;
            const nullHealthDamage = kf.healthDamage == null && damageEvent.healthDamage == null;
            return (
                !!kf.attacker &&
                !!kf.victim &&
                sameVictim &&
                sameAttacker &&
                sameKnockdown &&
                sameElimination &&
                nullShieldDamage &&
                nullHealthDamage &&
                nullHeadshot
            );
        });

        const timestampMsDiff = foundEvent
            ? differenceInMilliseconds(foundEvent.timestamp, damageEvent.timestamp)
            : Infinity;
        const hasSimilarDates = KILLFEED_UNIQUE_TIMEFRAME > Math.abs(timestampMsDiff);

        if (foundEvent && hasSimilarDates) {
            // Killfeed event appears to be duplicate
            return false;
        }

        // Primary source has not fired this killfeed event
        this.killfeedEvent$.next(damageEvent);
        const newkillfeedEventHistory = [...this.killfeedEventHistory$.value, damageEvent];
        this.killfeedEventHistory$.next(newkillfeedEventHistory);
        return true;
    }
}
