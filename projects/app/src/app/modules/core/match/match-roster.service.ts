import { Injectable } from "@angular/core";
import { MatchRosterPlayer } from "@app/models/match/roster-player.js";
import { MatchRosterTeammate } from "@app/models/match/roster-teammate.js";
import { MatchRoster } from "@app/models/match/roster.js";
import { isPlayerNameEqual } from "@app/models/utilities/player.js";
import { BaseService } from "@app/modules/core/base-service.abstract.js";
import { ConfigurationService } from "@app/modules/core/configuration.service.js";
import { MatchService } from "@app/modules/core/match/match.service.js";
import { SingletonServiceProviderFactory } from "@app/singleton-service.provider.factory.js";
import { cleanInt, findKeyByKeyRegEx, findValueByKeyRegEx, isEmpty } from "@shared/utilities/index.js";
import { BehaviorSubject, Observable } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";
import { OverwolfGameDataService, OWMatchInfo, OWMatchInfoRoster, OWMatchInfoTeammate } from "../overwolf/index.js";
import { PlayerService } from "../player.service.js";
import { MatchLegendSelectService } from "./match-legend-select.service.js";

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
export class MatchRosterService extends BaseService {
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
     * Arenas: From counting number of teams in the match roster
     * BattleRoyale: From Overwolf's "tabs" data
     * @returns {number} teams alive in the current match.
     */
    public readonly numTeams$ = new BehaviorSubject<number>(0);
    /**
     * Arenas: From counting number of teams in the match roster
     * BattleRoyale: Inferred from Overwolf's "tabs" data.
     * @returns {number} number of teams that the match started out with.
     */
    public readonly startingNumTeams$ = new BehaviorSubject<number>(0);
    /**
     * Arenas: From counting number of players in the match roster
     * BattleRoyale: From Overwolf's "tabs" data
     * @returns {number} players alive in the current match; 0 if "fair-play" mode is on (<5 players remain).
     */
    public readonly numPlayers$ = new BehaviorSubject<number>(0);
    /**
     * Arenas: From counting number of players in the match roster
     * BattleRoyale: Inferred from Overwolf's "tabs" data.
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
     * Emitted on every roster update, including merge events, and removal of invalid teammates
     */
    public readonly stagedTeammateRoster$ = new BehaviorSubject<MatchRoster<MatchRosterPlayer>>(new MatchRoster<MatchRosterTeammate>());

    private readonly isRosterNullPlayerDisconnect = true;
    private readonly rosterUpdate$: Observable<RosterUpdate>;

    constructor(
        private readonly configuration: ConfigurationService,
        private readonly match: MatchService,
        private readonly matchLegendSelect: MatchLegendSelectService,
        private readonly overwolfGameData: OverwolfGameDataService,
        private readonly player: PlayerService
    ) {
        super();
        this.rosterUpdate$ = this.setupRosterUpdate$();
        this.setupOnMatchStart();
        this.setupOnMatchEnd();
        this.setupPlayerCounts();
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
                is_local: prevRosterPlayer?.isMe ? "1" : "0",
                origin_id: prevRosterPlayer?.originId ?? "",
                platform_id: prevRosterPlayer?.platformId ?? "",
            };
            return {
                rosterId: rosterId,
                rosterItem: prevRosterItem,
                rosterAction: "DEL",
            };
        };

        return this.overwolfGameData.infoUpdates$.pipe(
            takeUntil(this.destroy$),
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
            filter((rosterUpdate) => rosterUpdate.rosterAction !== "DEL" || !this.isRosterNullPlayerDisconnect)
        );
    }

    /**
     * Resets states and emits rosters
     */
    private setupOnMatchStart(): void {
        this.match.startedEvent$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.numPlayers$.next(0);
            this.numTeams$.next(0);
            this.startingNumPlayers$.next(0);
            this.startingNumTeams$.next(0);

            // Clean any invalid Teammates
            this.cleanStagedTeammates();

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
        this.match.endedEvent$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.resetStagedRosters();
        });
    }

    /**
     * Update teams/players counters for BattleRoyale
     */
    private setupPlayerCounts(): void {
        this.overwolfGameData.infoUpdates$
            .pipe(
                takeUntil(this.destroy$),
                filter(() => !!this.match.gameMode$.value?.isBattleRoyaleGameMode),
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
                    isMe: isPlayerNameEqual(rosterItem!.name, this.player.myName$.value),
                    rosterId: rosterId,
                    originId: rosterItem?.origin_id,
                    platformId: rosterItem?.platform_id,
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
                    isMe: isPlayerNameEqual(rosterItem!.name, this.player.myName$.value),
                    rosterId: rosterId,
                    originId: rosterItem?.origin_id,
                    platformId: rosterItem?.platform_id,
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
                takeUntil(this.destroy$),
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
                    isMe: isPlayerNameEqual(teammate!.name, this.player.myName$.value),
                };
                this.addTeammate(newRosterTeammate);
            });
    }

    /**
     * Listens for teammate Legend Selections, matches player with Match Roster,
     *  and adds that combined result to the Staging Teammate Roster.
     */
    private setupTeammateLegends(): void {
        this.matchLegendSelect.legendSelected$.pipe(takeUntil(this.destroy$)).subscribe((legendSelect) => {
            const rosterPlayer = this.stagedMatchRoster$.value.allPlayers.find((p) => isPlayerNameEqual(p.name, legendSelect!.playerName));
            let newRosterTeammate: MatchRosterTeammate;

            if (rosterPlayer) newRosterTeammate = { ...rosterPlayer, legend: legendSelect.legend };
            else {
                newRosterTeammate = {
                    name: legendSelect!.playerName,
                    isMe: isPlayerNameEqual(legendSelect!.playerName, this.player.myName$.value),
                    legend: legendSelect.legend,
                };
            }

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
                isMe: isPlayerNameEqual(teammate.name, this.player.myName$.value),
                legend: teammate.legend ?? existingTeammate.legend,
                platformHardware: teammate.platformHardware ?? existingTeammate.platformHardware,
                platformSoftware: teammate.platformSoftware ?? existingTeammate.platformSoftware,
                rosterId: teammate.rosterId ?? existingTeammate.rosterId,
                originId: teammate.originId ?? existingTeammate.originId,
                platformId: teammate.platformId ?? existingTeammate.platformId,
                teamId: teammate.platformSoftware ?? existingTeammate.teamId,
            };
        }
        const newStagedTeammateRoster = this.stagedTeammateRoster$.value;
        newStagedTeammateRoster.addPlayer(mergedTeammate);

        this.stagedTeammateRoster$.next(newStagedTeammateRoster);
    }

    /**
     * Sub-method that removes staged teammates that don't exist on the staged match roster
     */
    private cleanStagedTeammates(): void {
        const newStagedTeammateRoster = this.stagedTeammateRoster$.value;
        newStagedTeammateRoster.allPlayers.forEach((player) => {
            const foundRosterPlayer = !!this.stagedMatchRoster$.value.allPlayers.find((mr) => isPlayerNameEqual(mr.name, player.name));
            if (!foundRosterPlayer) {
                console.warn(`An extra teammate was found in the staged teammater roster; Removing extra teammate: "${player.name}"`);
                newStagedTeammateRoster.removePlayer(player.name);
            }
        });

        this.stagedTeammateRoster$.next(newStagedTeammateRoster);
    }

    private resetStagedRosters(): void {
        this.stagedMatchRoster$.next(new MatchRoster());
        this.stagedTeammateRoster$.next(new MatchRoster<MatchRosterTeammate>());
    }
}
