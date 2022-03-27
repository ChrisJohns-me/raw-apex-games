import { WeaponItem } from "@allfather-app/app/common/items/weapon-item";
import { MatchInflictionEvent } from "@allfather-app/app/common/match/infliction-event";
import { MatchRosterPlayer } from "@allfather-app/app/common/match/roster-player";
import { PlayerState } from "@allfather-app/app/common/player-state";
import { BaseService } from "@allfather-app/app/common/services/base-service.abstract";
import { OverwolfGameDataService, OWGameEventKillFeed } from "@allfather-app/app/common/services/overwolf";
import { isPlayerNameEqual } from "@allfather-app/app/common/utilities/player";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { isEmpty } from "common/utilities/";
import { BehaviorSubject, Subject } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";
import { MatchRosterService } from "./match-roster.service";
import { MatchService } from "./match.service";

const KILLFEED_SECONDARY_DELAY = 1000; // Should be larger than `KILLFEED_UNIQUE_TIMEFRAME`
const KILLFEED_UNIQUE_TIMEFRAME = 3000; // Prevents duplicates from Primary & Secondary source within this timeframe

/**
 * @classdesc Provides all killfeed events.
 */
@Injectable({
    providedIn: "root",
    deps: [MatchService, MatchRosterService, OverwolfGameDataService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchKillfeedService", MatchKillfeedService, deps),
})
export class MatchKillfeedService extends BaseService {
    public readonly killfeedEvent$ = new Subject<MatchInflictionEvent>();
    public readonly killfeedEventHistory$ = new BehaviorSubject<MatchInflictionEvent[]>([]);

    constructor(
        private readonly match: MatchService,
        private readonly matchRoster: MatchRosterService,
        private readonly overwolfGameData: OverwolfGameDataService
    ) {
        super();
        this.setupOnMatchStart();
        this.setupKillfeed();
    }

    /**
     * Accounts for knockdowns and eliminations done by requested player via killfeed (inferring that the requested player might be alive).
     * Makes assumption about disconnected players to be eliminated.
     * @param player
     */
    public playerLastKnownState(player: MatchRosterPlayer): Optional<{ timestamp: Date; state: PlayerState }> {
        if (isEmpty(player.name)) return;
        if (isEmpty(this.matchRoster.matchRoster$.value.allPlayers)) return undefined;
        const playerKillfeedHistory = this.killfeedEventHistory$.value
            .filter((kf) => isPlayerNameEqual(kf.victim.name, player.name) || isPlayerNameEqual(kf.attacker?.name, player.name))
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        const lastKnownActivity = playerKillfeedHistory[0];
        const lastKnownActivityDate = lastKnownActivity?.timestamp ?? this.match.state$.value.startDate;

        const playerDisconnection = this.matchRoster.rosterPlayerDisconnectionList$.value
            .filter((p) => isPlayerNameEqual(p.rosterPlayer.name, player.name))
            .find((p) => p.timestamp > lastKnownActivityDate);
        if (!isEmpty(playerDisconnection)) {
            return {
                timestamp: playerDisconnection!.timestamp,
                state: PlayerState.Disconnected,
            };
        }

        const isKnocked = isPlayerNameEqual(lastKnownActivity?.victim?.name, player.name) && lastKnownActivity?.isKnockdown;
        const isEliminated = isPlayerNameEqual(lastKnownActivity?.victim?.name, player.name) && lastKnownActivity?.isElimination;
        return {
            timestamp: lastKnownActivityDate,
            state: isKnocked ? PlayerState.Knocked : isEliminated ? PlayerState.Eliminated : PlayerState.Alive,
        };
    }

    /**
     * Reset state on match start
     */
    private setupOnMatchStart(): void {
        this.match.startedEvent$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.killfeedEventHistory$.next([]);
        });
    }

    /**
     * Primary source of killfeed events. From the gameEvent name: "kill_feed"
     */
    private setupKillfeed(): void {
        this.overwolfGameData.newGameEvent$
            .pipe(
                takeUntil(this.destroy$),
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
                const isVictimEliminated = !!(
                    // it's possible the Melee is also an elimination
                    (action === "Bleed Out" || action === "kill" || action === "headshot_kill" || action === "Finisher")
                );
                if (!victim) return;

                const newKillfeedEvent: MatchInflictionEvent = {
                    timestamp: new Date(),
                    victim: victim,
                    attacker: attacker,
                    isKnockdown: isVictimKnocked,
                    isElimination: isVictimEliminated,
                    weapon,
                };

                this.killfeedEvent$.next(newKillfeedEvent);
                const newkillfeedEventHistory = [...this.killfeedEventHistory$.value, newKillfeedEvent];
                this.killfeedEventHistory$.next(newkillfeedEventHistory);
            });
    }
}
