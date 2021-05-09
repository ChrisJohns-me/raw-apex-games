import { ConfigurationService } from "@allfather-app/app/modules/core/configuration/configuration.service";
import { OverwolfGameDataService, OWMatchInfo, OWMatchInfoRoster, OWMatchInfoTeammate } from "@allfather-app/app/modules/core/overwolf";
import { PlayerService } from "@allfather-app/app/modules/core/player.service";
import { MatchRoster } from "@allfather-app/app/shared/models/match/roster";
import { MatchRosterPlayer } from "@allfather-app/app/shared/models/match/roster-player";
import { MatchRosterTeammate } from "@allfather-app/app/shared/models/match/roster-teammate";
import { isPlayerNameEqual } from "@allfather-app/app/shared/models/utilities/player";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";
import { cleanInt, findKeyByKeyRegEx, findValueByKeyRegEx, isEmpty } from "shared/utilities";
import { AllfatherService } from "../allfather-service.abstract";
import { MatchLegendSelectService } from "./match-legend-select.service";
import { MatchService } from "./match.service";

type RosterUpdate = { rosterId: number; rosterItem: Optional<OWMatchInfoRoster>; rosterAction: "ADD" | "DEL" };
type RosterPlayerDisconnection = { timestamp: Date; rosterPlayer: OWMatchInfoRoster };

/**
 * @classdesc Provides a list, counts, and information about players in the match.
 */
@Injectable({
    providedIn: "root",
    deps: [ConfigurationService, MatchService, MatchLegendSelectService, OverwolfGameDataService, PlayerService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchRosterService", MatchRosterService, deps),
})
export class MatchRosterService extends AllfatherService {
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
     * Inferred from Overwolf's "tabs" data.
     * @returns {number} number of teams that the match started out with.
     */
    public readonly startingNumTeams$ = new BehaviorSubject<number>(0);
    /**
     * From Overwolf's "tabs" data
     * @returns {number} players alive in the current match; 0 if "fair-play" mode is on (<5 players remain).
     */
    public readonly numPlayers$ = new BehaviorSubject<number>(0);
    /**
     * Inferred from Overwolf's "tabs" data.
     * @returns {number} number of players that the match started out with.
     */
    public readonly startingNumPlayers$ = new BehaviorSubject<number>(0);
    /**
     * Preloaded match roster data.
     * Emitted on every roster update.
     */
    public readonly stagedMatchRoster$ = new BehaviorSubject<MatchRoster>(new MatchRoster());
    /**
     * Preloaded match roster data.
     * Emitted on every roster update, including merge events.
     */
    public readonly stagedTeammateRoster$ = new BehaviorSubject<MatchRoster<MatchRosterPlayer>>(new MatchRoster<MatchRosterTeammate>());

    private readonly rosterUpdate$: Observable<RosterUpdate>;

    constructor(
        private readonly config: ConfigurationService,
        private readonly match: MatchService,
        private readonly matchLegendSelect: MatchLegendSelectService,
        private readonly overwolfGameData: OverwolfGameDataService,
        private readonly player: PlayerService
    ) {
        super();
        this.rosterUpdate$ = this.setupRosterUpdate$();
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
            const me = this.matchRoster$.value.allPlayers.find((p) => p.isMe);
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

        return this.overwolfGameData.infoUpdates$.pipe(
            takeUntil(this.isDestroyed$),
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
        this.match.startedEvent$.pipe(takeUntil(this.isDestroyed$)).subscribe(() => {
            this.numPlayers$.next(0);
            this.numTeams$.next(0);
            this.startingNumPlayers$.next(0);
            this.startingNumTeams$.next(0);

            // Rosters should be ready to be emitted
            if (this.stagedMatchRoster$.value.allPlayers.length) this.matchRoster$.next(this.stagedMatchRoster$.value);
            else console.error(`Could not emit roster; staged match roster was empty!`);

            if (this.stagedTeammateRoster$.value.allPlayers.length) this.teammateRoster$.next(this.stagedTeammateRoster$.value);
            else console.error(`Could not emit team roster; staged team roster was empty!`);

            this.resetStagedRosters();
        });
    }

    /**
     * Resets state on match start
     */
    private setupOnMatchEnd(): void {
        this.match.endedEvent$.pipe(takeUntil(this.isDestroyed$)).subscribe(() => {
            this.resetStagedRosters();
        });
    }

    /**
     * Update teams/players counters
     */
    private setupCounts(): void {
        this.overwolfGameData.infoUpdates$
            .pipe(
                takeUntil(this.isDestroyed$),
                filter((infoUpdate) => infoUpdate.feature === "match_info" && !!infoUpdate.info.match_info?.tabs),
                map((infoUpdate) => infoUpdate.info.match_info?.tabs),
                filter((tabs) => !isEmpty(tabs))
            )
            .subscribe((tabs) => {
                const numTeams = cleanInt(tabs!.teams);
                const numPlayers = cleanInt(tabs!.players);

                if (numTeams >= 0) {
                    this.numTeams$.next(numTeams);
                    if (numTeams > this.startingNumTeams$.value) {
                        this.startingNumTeams$.next(numTeams);
                    }
                }

                if (numPlayers >= 0) {
                    this.numPlayers$.next(numPlayers);
                    if (numPlayers > this.startingNumPlayers$.value) {
                        this.startingNumPlayers$.next(numPlayers);
                    }
                }
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
                    isMe: rosterItem!.name === this.player.myName$.value,
                    rosterId: rosterId,
                    teamId: rosterItem!.team_id,
                    platformHardware: rosterItem?.platform_hw,
                    platformSoftware: rosterItem?.platform_sw,
                };

                const newStagedMatchRoster = this.stagedMatchRoster$.value;
                newStagedMatchRoster.addPlayer(newRosterPlayer);

                this.stagedMatchRoster$.next(newStagedMatchRoster);
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
                    isMe: rosterItem!.name === this.player.myName$.value,
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
        this.overwolfGameData.infoUpdates$
            .pipe(
                takeUntil(this.isDestroyed$),
                // Should only receive roster additions prior to the match start
                filter(() => !this.match.isActive),
                filter((infoUpdate) => infoUpdate.feature === "team"),
                map((infoUpdate) => infoUpdate.info.match_info),
                map((m) => findValueByKeyRegEx<OWMatchInfoTeammate>(m, /^teammate_/)),
                filter((teammate) => !isEmpty(teammate?.name))
            )
            .subscribe((teammate) => {
                const newRosterTeammate: MatchRosterTeammate = {
                    name: teammate!.name,
                    isMe: teammate!.name === this.player.myName$.value,
                };
                this.addTeammate(newRosterTeammate);
            });
    }

    /**
     * Listens for teammate Legend Selections, matches player with Match Roster,
     *  and adds that combined result to the Staging Teammate Roster.
     */
    private setupTeammateLegends(): void {
        this.matchLegendSelect.legendSelected$.pipe(takeUntil(this.isDestroyed$)).subscribe((legendSelect) => {
            const rosterPlayer = this.stagedMatchRoster$.value.allPlayers.find((p) => isPlayerNameEqual(p.name, legendSelect!.playerName));
            let newRosterTeammate: MatchRosterTeammate;

            if (rosterPlayer) newRosterTeammate = { ...rosterPlayer, legend: legendSelect.legend };
            else
                newRosterTeammate = {
                    name: legendSelect!.playerName,
                    isMe: legendSelect!.playerName === this.player.myName$.value,
                    legend: legendSelect.legend,
                };

            const newStagedTeammateRoster = this.stagedTeammateRoster$.value;
            newStagedTeammateRoster.addPlayer(newRosterTeammate);

            this.stagedTeammateRoster$.next(newStagedTeammateRoster);
        });
    }

    /**
     * Sub-method that takes in a teammate, and adds/merges them to the Staging Teammate Roster
     */
    private addTeammate(teammate: MatchRosterTeammate): void {
        const existingTeammate = this.teammateRoster$.value.allPlayers.find((p) => isPlayerNameEqual(p.name, teammate.name));
        let mergedTeammate: MatchRosterTeammate = teammate;
        if (existingTeammate) {
            mergedTeammate = {
                name: teammate.name,
                isMe: teammate.name === this.player.myName$.value,
                legend: teammate.legend ?? existingTeammate.legend,
                platformHardware: teammate.platformHardware ?? existingTeammate.platformHardware,
                platformSoftware: teammate.platformSoftware ?? existingTeammate.platformSoftware,
                rosterId: teammate.rosterId ?? existingTeammate.rosterId,
                teamId: teammate.platformSoftware ?? existingTeammate.teamId,
            };
        }
        const newStagedTeammateRoster = this.stagedTeammateRoster$.value;
        newStagedTeammateRoster.addPlayer(mergedTeammate);

        this.stagedTeammateRoster$.next(newStagedTeammateRoster);
    }

    private resetStagedRosters(): void {
        this.stagedMatchRoster$.next(new MatchRoster());
        this.stagedTeammateRoster$.next(new MatchRoster<MatchRosterTeammate>());
    }
}
