import { Injectable, OnDestroy } from "@angular/core";
import { SingletonServiceProviderFactory } from "@app/singleton-service.provider.factory";
import { OverwolfDataProviderService, OWMatchInfoRoster, OWMatchInfoTeammate } from "@core/overwolf-data-provider";
import { MatchRoster } from "@shared/models/match/match-roster";
import { MatchRosterPlayer } from "@shared/models/match/match-roster-player";
import { MatchRosterTeammate } from "@shared/models/match/match-roster-teammate";
import { isPlayerNameEqual } from "@shared/models/utilities/player";
import { findKeyByKeyRegEx, findValueByKeyRegEx, isEmpty } from "@shared/utilities";
import { cleanInt } from "@shared/utilities/number";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";
import { MatchLegendSelectService } from "./match-legend-select.service";
import { MatchService } from "./match.service";

/**
 * @classdesc Provides a list, counts, and information about players in the match.
 */
@Injectable({
    providedIn: "root",
    deps: [MatchService, MatchLegendSelectService, OverwolfDataProviderService],
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
     * From Overwolf's "tabs" data
     * @returns {number} teams alive in the current match.
     */
    public readonly numTeams$ = new BehaviorSubject<number>(0);
    /**
     * From Overwolf's "tabs" data
     * @returns {number} players alive in the current match; 0 if "fair-play" mode is on (<5 players remain).
     */
    public readonly numPlayers$ = new BehaviorSubject<number>(0);

    private readonly rosterUpdate$: Observable<[rosterKey: string, rosterItem: Optional<OWMatchInfoRoster>]>;

    private stagedMatchRoster = new MatchRoster();
    private stagedTeammateRoster = new MatchRoster<MatchRosterTeammate>();
    private readonly _unsubscribe$ = new Subject<void>();

    constructor(
        private readonly match: MatchService,
        private readonly matchLegendSelect: MatchLegendSelectService,
        private readonly overwolf: OverwolfDataProviderService
    ) {
        this.rosterUpdate$ = this.overwolf.infoUpdates$.pipe(
            takeUntil(this._unsubscribe$),
            filter((infoUpdate) => infoUpdate.feature === "roster"),
            map((infoUpdate) => infoUpdate.info.match_info),
            map((matchInfo): [string, Optional<OWMatchInfoRoster>] => [
                findKeyByKeyRegEx(matchInfo, /^roster_/) as string,
                findValueByKeyRegEx<OWMatchInfoRoster>(matchInfo, /^roster_/),
            ]),
            filter(([rosterKey]) => !isEmpty(rosterKey))
        );
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
        this.setupTeammateRosterPrimary();
        this.setupTeammateRosterSecondary();
        this.setupTeammateLegends();
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
        this.overwolf.infoUpdates$
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
                filter(([, rosterItem]) => !isEmpty(rosterItem?.name) && !isEmpty(rosterItem?.team_id))
            )
            .subscribe(([rosterKey, rosterItem]) => {
                const newRosterPlayer: MatchRosterPlayer = {
                    name: rosterItem!.name,
                    rosterKey: rosterKey,
                    teamId: rosterItem!.team_id,
                    platformHardware: rosterItem?.platform_hw,
                    platformSoftware: rosterItem?.platform_sw,
                };

                this.stagedMatchRoster.addPlayer(newRosterPlayer);
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
                filter(([, rosterItem]) => !isEmpty(rosterItem) && !!rosterItem?.isTeammate)
            )
            .subscribe(([rosterKey, rosterItem]) => {
                rosterItem = rosterItem!;

                const newRosterTeammate: MatchRosterTeammate = {
                    name: rosterItem.name,
                    rosterKey: rosterKey,
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
        this.overwolf.infoUpdates$
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
                rosterKey: teammate.rosterKey ?? existingTeammate.rosterKey,
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
