import { Injectable, OnDestroy } from "@angular/core";
import { WeaponItem } from "@common/items/weapon-item";
import { MatchInflictionEvent } from "@common/match/match-infliction-event";
import { isPlayerNameEqual } from "@common/utilities/player";
import { OverwolfDataProviderService, OWGameEventKillFeed } from "@core/overwolf-data-provider";
import { differenceInMilliseconds } from "date-fns";
import { BehaviorSubject, Subject } from "rxjs";
import { delay, filter, map, takeUntil } from "rxjs/operators";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { PlayerService } from "../player.service";
import { MatchRosterService } from "./match-roster.service";
import { MatchService } from "./match.service";

// TODO: Test:
const KILLFEED_SECONDARY_DELAY = 1000; // Should be larger than `KILLFEED_UNIQUE_TIMEFRAME`
const KILLFEED_UNIQUE_TIMEFRAME = 3000; // Prevents duplicates from Primary & Secondary source within this timeframe

/**
 * @classdesc Provides all killfeed events.
 */
@Injectable({
    providedIn: "root",
    deps: [MatchService, MatchRosterService, OverwolfDataProviderService, PlayerService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchActivityService", MatchActivityService, deps),
})
export class MatchActivityService implements OnDestroy {
    public readonly killfeedEvent$ = new Subject<MatchInflictionEvent>();
    public readonly killfeedEventHistory$ = new BehaviorSubject<MatchInflictionEvent[]>([]);

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
        this.setupOnMatchStart();
        this.setupKillfeed();
        this.setupKillsAndKnockdowns();
    }

    /**
     * Reset state on match start
     */
    private setupOnMatchStart(): void {
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
                const allRosterPlayers = this.matchRoster.matchRoster$.value.allPlayers;
                const victim = allRosterPlayers.find((p) => isPlayerNameEqual(p.name, killfeed.victimName));
                const attacker = allRosterPlayers.find((p) => isPlayerNameEqual(p.name, killfeed.attackerName));
                const weapon = new WeaponItem({ fromInGameEventName: killfeed.weaponName });
                const action = killfeed.action;
                const isVictimKnocked = !!(action === "Melee" || action === "Caustic Gas" || action === "knockdown");
                const isVictimEliminated = !!(action === "Bleed Out" || action === "kill" || action === "headshot_kill");
                if (!victim) return;

                const newKillfeedEvent: MatchInflictionEvent = {
                    timestamp: new Date(),
                    victim: victim,
                    attacker: attacker,
                    isKnockdown: isVictimKnocked,
                    isElimination: isVictimEliminated,
                    weapon,
                };

                this.addUniqueKillfeedEvent(newKillfeedEvent);
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
                if (!this.player.myName$.value) return;
                const actionData = gameEvent.data as KillOrKnockdownData;
                const allRosterPlayers = this.matchRoster.matchRoster$.value.allPlayers;
                const victim = allRosterPlayers.find((p) => isPlayerNameEqual(p.name, actionData.victimName));
                const attacker = allRosterPlayers.find((p) => isPlayerNameEqual(p.name, this.player.myName$.value));
                const weapon = new WeaponItem({});
                const isVictimKnocked = gameEvent.name === "knockdown";
                const isVictimEliminated = gameEvent.name === "kill";
                if (!victim) return;

                const newMatchInflictionEvent: MatchInflictionEvent = {
                    timestamp: new Date(),
                    victim: victim,
                    attacker: attacker,
                    isKnockdown: isVictimKnocked,
                    isElimination: isVictimEliminated,
                    weapon,
                };
                if (this.addUniqueKillfeedEvent(newMatchInflictionEvent)) {
                    console.warn(
                        `"${gameEvent.name}" killfeed action was not emitted by primary source (name: kill_feed);` +
                            ` but was found in secondary source (name: ${gameEvent.name}).`,
                        newMatchInflictionEvent
                    );
                }
            });
    }

    /**
     * Adds unique killfeed events to the history, and emits a killfeed event.
     * @returns {boolean} true if the item is unique.
     */
    private addUniqueKillfeedEvent(killfeedEvent: MatchInflictionEvent): boolean {
        const foundEvent = this.killfeedEventHistory$.value.find((kf) => {
            const sameVictim: boolean = isPlayerNameEqual(kf.victim.name, killfeedEvent.victim.name);
            const sameAttacker: boolean = isPlayerNameEqual(kf.attacker?.name, killfeedEvent.attacker?.name);
            const sameKnockdown: boolean = kf.isKnockdown === killfeedEvent.isKnockdown;
            const sameElimination: boolean = kf.isElimination === killfeedEvent.isElimination;
            const nullHeadshot: boolean = kf.isHeadshot == null && killfeedEvent.isHeadshot == null;
            const nullShieldDamage: boolean = kf.shieldDamage == null && killfeedEvent.shieldDamage == null;
            const nullHealthDamage: boolean = kf.healthDamage == null && killfeedEvent.healthDamage == null;
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

        const timestampMsDiff = foundEvent ? differenceInMilliseconds(foundEvent.timestamp, killfeedEvent.timestamp) : Infinity;
        const hasSimilarDates = KILLFEED_UNIQUE_TIMEFRAME > Math.abs(timestampMsDiff);

        if (foundEvent && hasSimilarDates) {
            // Killfeed event appears to be duplicate
            return false;
        }

        // Primary source has not fired this killfeed event
        this.killfeedEvent$.next(killfeedEvent);
        const newkillfeedEventHistory = [...this.killfeedEventHistory$.value, killfeedEvent];
        this.killfeedEventHistory$.next(newkillfeedEventHistory);
        return true;
    }
}
