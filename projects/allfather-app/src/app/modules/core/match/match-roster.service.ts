import { ConfigurationService } from "@allfather-app/app/modules/core/configuration/configuration.service";
import {
    OverwolfDataProviderService,
    OWMatchInfo,
    OWMatchInfoRoster,
    OWMatchInfoTeammate,
} from "@allfather-app/app/modules/core/overwolf-data-provider";
import { PlayerService } from "@allfather-app/app/modules/core/player.service";
import { MatchRoster } from "@allfather-app/app/shared/models/match/match-roster";
import { MatchRosterPlayer } from "@allfather-app/app/shared/models/match/match-roster-player";
import { MatchRosterTeammate } from "@allfather-app/app/shared/models/match/match-roster-teammate";
import { isPlayerNameEqual } from "@allfather-app/app/shared/models/utilities/player";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";
import { cleanInt, findKeyByKeyRegEx, findValueByKeyRegEx, isEmpty } from "shared/utilities";
import { MatchLegendSelectService } from "./match-legend-select.service";
import { MatchService } from "./match.service";

type RosterUpdate = { rosterId: number; rosterItem: Optional<OWMatchInfoRoster>; rosterAction: "ADD" | "DEL" };
type RosterPlayerDisconnection = { timestamp: Date; rosterPlayer: OWMatchInfoRoster };

/**
 * @classdesc Provides a list, counts, and information about players in the match.
 */
@Injectable({
    providedIn: "root",
    deps: [ConfigurationService, MatchService, MatchLegendSelectService, OverwolfDataProviderService, PlayerService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchRosterService", MatchRosterService, deps),
})
export class MatchRosterService implements OnDestroy {
    /**
     * Provides list of players in the current match.
     * Emits only at the beginning of the match, or upon subscription.
     * @returns {MatchRoster}
     */
    public readonly matchRoster$ = new BehaviorSubject<MatchRoster>(new MatchRoster());
    /**
     * Provides list of teammates in the current match.
     * Emits on each legend selection, at beginning of the match, or upon subscription.
     * @returns {MatchRoster<MatchRosterTeammate>}
     */
    public readonly teammateRoster$ = new BehaviorSubject<MatchRoster<MatchRosterTeammate>>(new MatchRoster<MatchRosterTeammate>());
    /**
     * @returns {RosterPlayerDisconnected[]} List of players in the match who may have disconnected.
     */
    public readonly rosterPlayerDisconnectionList$ = new BehaviorSubject<RosterPlayerDisconnection[]>([]);
    /**
     * From Overwolf's "tabs" data
     * @returns {number} teams alive in the current match.
     */
    public readonly numTeams$ = new BehaviorSubject<number>(0);
    /**
     * From Overwolf's "tabs" data
     * @returns {number} players alive in the current match; 0 if "fair-play" mode is on (<5 players remain).
     */
    public readonly numPlayers$ = new BehaviorSubject<number>(0);

    private readonly rosterUpdate$: Observable<RosterUpdate>;

    private stagedMatchRoster = new MatchRoster();
    private stagedTeammateRoster = new MatchRoster<MatchRosterTeammate>();
    private readonly _unsubscribe$ = new Subject<void>();

    constructor(
        private readonly config: ConfigurationService,
        private readonly match: MatchService,
        private readonly matchLegendSelect: MatchLegendSelectService,
        private readonly overwolfData: OverwolfDataProviderService,
        private readonly player: PlayerService
    ) {
        this.rosterUpdate$ = this.setupRosterUpdate$();
    }

    public ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    public start(): void {
        this.setupOnMatchStart();
        this.setupOnMatchEnd();
        this.setupCounts();
        this.setupMatchRoster();
        this.setupPlayerDisconnectionList();
        this.setupTeammateRosterPrimary();
        this.setupTeammateRosterSecondary();
        this.setupTeammateLegends();
    }

    /**
     * @returns {Observable<RosterUpdate>} stream with information about the addition or removal of roster items.
     */
    private setupRosterUpdate$(): Observable<RosterUpdate> {
        const rosterAdditionFn = (rosterId: number, rosterInfo: OWMatchInfoRoster): RosterUpdate => ({
            rosterId: rosterId,
            rosterItem: rosterInfo,
            rosterAction: "ADD",
        });
        const rosterDeletionFn = (rosterId: number): RosterUpdate => {
            const me = this.matchRoster$.value.allPlayers.find((p) => isPlayerNameEqual(p.name, this.player.myName$.value));
            const prevRosterPlayer = this.matchRoster$.value.allPlayers.find((p) => p.rosterId === rosterId);
            const prevRosterItem: OWMatchInfoRoster = {
                isTeammate: prevRosterPlayer?.teamId === me?.teamId,
                name: prevRosterPlayer?.name ?? "",
                platform_hw: prevRosterPlayer?.platformHardware ?? 2,
                platform_sw: prevRosterPlayer?.platformSoftware ?? 2,
                team_id: prevRosterPlayer?.teamId ?? -1,
                state: "dead",
            };
            return {
                rosterId: rosterId,
                rosterItem: prevRosterItem,
                rosterAction: "DEL",
            };
        };

        return this.overwolfData.infoUpdates$.pipe(
            takeUntil(this._unsubscribe$),
            filter((infoUpdate) => infoUpdate.feature === "roster"),
            map((infoUpdate) => infoUpdate.info.match_info),
            map((matchInfo): [number, OWMatchInfo] => {
                const rosterKey = findKeyByKeyRegEx(matchInfo, /^roster_/) as string;
                const rosterId = rosterKey.match(/\d*/g)?.join("") ?? "-1";
                return [parseInt(rosterId), matchInfo as OWMatchInfo];
            }),
            map(([rosterId, matchInfo]) => {
                if (!isEmpty(matchInfo)) {
                    const rosterInfo = (matchInfo as any)[`roster_${rosterId}`] as OWMatchInfoRoster;
                    return rosterAdditionFn(rosterId, rosterInfo);
                } else {
                    return rosterDeletionFn(rosterId);
                }
            }),
            filter((rosterUpdate) => rosterUpdate.rosterAction !== "DEL" || !this.config.assumptions.isRosterNullPlayerDisconnect)
        );
    }

    /**
     * Resets states and emits rosters
     */
    private setupOnMatchStart(): void {
        this.match.startedEvent$.pipe(takeUntil(this._unsubscribe$)).subscribe(() => {
            this.numPlayers$.next(0);
            this.numTeams$.next(0);
            // Rosters should be ready to be emitted
            if (this.stagedMatchRoster.allPlayers.length) this.matchRoster$.next(this.stagedMatchRoster);
            else console.error(`Could not emit roster; staged match roster was empty!`);

            if (this.stagedTeammateRoster.allPlayers.length) this.teammateRoster$.next(this.stagedTeammateRoster);
            else console.error(`Could not emit team roster; staged team roster was empty!`);

            this.resetStagedRosters();
        });
    }

    /**
     * Resets state on match start
     */
    private setupOnMatchEnd(): void {
        this.match.endedEvent$.pipe(takeUntil(this._unsubscribe$)).subscribe(() => {
            this.resetStagedRosters();
        });
    }

    /**
     * Update teams/players counters
     */
    private setupCounts(): void {
        this.overwolfData.infoUpdates$
            .pipe(
                takeUntil(this._unsubscribe$),
                filter((infoUpdate) => infoUpdate.feature === "match_info" && !!infoUpdate.info.match_info?.tabs),
                map((infoUpdate) => infoUpdate.info.match_info?.tabs),
                filter((tabs) => !isEmpty(tabs))
            )
            .subscribe((tabs) => {
                const numTeams = cleanInt(tabs!.teams);
                const numPlayers = cleanInt(tabs!.players);

                if (numTeams >= 0) this.numTeams$.next(numTeams);
                if (numPlayers >= 0) this.numPlayers$.next(numPlayers);
            });
    }

    /**
     * Listens to the roster info prior to a match,
     *  pushes all roster items into a staging variable.
     */
    private setupMatchRoster(): void {
        this.rosterUpdate$
            .pipe(
                // Should only receive roster additions prior to the match start
                filter(() => !this.match.isActive),
                filter(
                    ({ rosterItem, rosterAction }) => rosterAction === "ADD" && !isEmpty(rosterItem?.name) && !isEmpty(rosterItem?.team_id)
                )
            )
            .subscribe(({ rosterId, rosterItem }) => {
                const newRosterPlayer: MatchRosterPlayer = {
                    name: rosterItem!.name,
                    rosterId: rosterId,
                    teamId: rosterItem!.team_id,
                    platformHardware: rosterItem?.platform_hw,
                    platformSoftware: rosterItem?.platform_sw,
                };

                this.stagedMatchRoster.addPlayer(newRosterPlayer);
            });
    }

    /**
     * Listens to the roster info prior to a match,
     *  pushes all roster items into a staging variable.
     */
    private setupPlayerDisconnectionList(): void {
        this.rosterUpdate$
            .pipe(
                filter(() => !this.match.isActive),
                filter(({ rosterItem, rosterAction }) => rosterAction === "DEL" && !isEmpty(rosterItem?.name))
            )
            .subscribe(({ rosterItem }) => {
                if (!rosterItem) return;
                const rosterPlayerDisconnection: RosterPlayerDisconnection = { timestamp: new Date(), rosterPlayer: rosterItem };
                this.rosterPlayerDisconnectionList$.next([...this.rosterPlayerDisconnectionList$.value, rosterPlayerDisconnection]);
            });
    }

    /**
     * Listens to "feature":"roster" info prior to a match,
     *  pushes all roster items into a staging variable.
     */
    private setupTeammateRosterPrimary(): void {
        this.rosterUpdate$
            .pipe(
                // Should only receive roster additions prior to the match start
                filter(() => !this.match.isActive),
                filter(({ rosterItem, rosterAction }) => rosterAction === "ADD" && !isEmpty(rosterItem) && !!rosterItem?.isTeammate)
            )
            .subscribe(({ rosterId, rosterItem }) => {
                rosterItem = rosterItem!;

                const newRosterTeammate: MatchRosterTeammate = {
                    name: rosterItem.name,
                    rosterId: rosterId,
                    teamId: rosterItem.team_id,
                    platformHardware: rosterItem.platform_hw,
                    platformSoftware: rosterItem.platform_sw,
                    legend: undefined,
                };

                this.addTeammate(newRosterTeammate);
            });
    }

    /**
     * Listens to "feature":"team" info prior to a match,
     *  pushes all roster items into a staging variable.
     * Mostly only useful for getting teammate's name, if primary source fails.
     */
    private setupTeammateRosterSecondary(): void {
        this.overwolfData.infoUpdates$
            .pipe(
                takeUntil(this._unsubscribe$),
                filter((infoUpdate) => infoUpdate.feature === "team"),
                map((infoUpdate) => infoUpdate.info.match_info),
                map((m) => findValueByKeyRegEx<OWMatchInfoTeammate>(m, /^teammate_/)),
                filter((teammate) => !isEmpty(teammate?.name))
            )
            .subscribe((teammate) => {
                const newRosterTeammate: MatchRosterTeammate = { name: teammate!.name };
                this.addTeammate(newRosterTeammate);
            });
    }

    private setupTeammateLegends(): void {
        this.matchLegendSelect.legendSelected$.pipe(takeUntil(this._unsubscribe$)).subscribe((legendSelect) => {
            const rosterPlayer = this.stagedMatchRoster.allPlayers.find((p) => isPlayerNameEqual(p.name, legendSelect!.playerName));
            let newRosterTeammate: MatchRosterTeammate;

            if (rosterPlayer) newRosterTeammate = { ...rosterPlayer, legend: legendSelect.legend };
            else newRosterTeammate = { name: legendSelect!.playerName, legend: legendSelect.legend };

            this.stagedTeammateRoster.addPlayer(newRosterTeammate);
        });
    }

    private addTeammate(teammate: MatchRosterTeammate): void {
        const existingTeammate = this.teammateRoster$.value.allPlayers.find((p) => isPlayerNameEqual(p.name, teammate.name));
        let mergedTeammate: MatchRosterTeammate = teammate;
        if (existingTeammate) {
            mergedTeammate = {
                name: teammate.name,
                legend: teammate.legend ?? existingTeammate.legend,
                platformHardware: teammate.platformHardware ?? existingTeammate.platformHardware,
                platformSoftware: teammate.platformSoftware ?? existingTeammate.platformSoftware,
                rosterId: teammate.rosterId ?? existingTeammate.rosterId,
                teamId: teammate.platformSoftware ?? existingTeammate.teamId,
            };
        }

        this.stagedTeammateRoster.addPlayer(mergedTeammate);
    }

    private resetStagedRosters(): void {
        this.stagedMatchRoster = new MatchRoster();
        this.stagedTeammateRoster = new MatchRoster<MatchRosterTeammate>();
    }
}
