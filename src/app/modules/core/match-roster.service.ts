import { Injectable, OnDestroy } from "@angular/core";
import { Legend } from "@common/legend";
import { MatchRoster } from "@common/match/match-roster";
import { MatchRosterPlayer } from "@common/match/match-roster-player";
import { MatchRosterTeammate } from "@common/match/match-roster-teammate";
import { isPlayerNameEqual } from "@common/utilities/player";
import { BehaviorSubject, Subject } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { findKeyByKeyRegEx, findValueByKeyRegEx, isEmpty } from "src/utilities";
import { cleanInt } from "src/utilities/number";
import { MatchService } from "./match.service";
import { OverwolfDataProviderService, OWMatchInfoRoster } from "./overwolf-data-provider";

/**
 * @classdesc Provides a list, counts, and information about players in the match.
 */
@Injectable({
    providedIn: "root",
    deps: [MatchService, OverwolfDataProviderService],
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

    private stagedMatchRoster = new MatchRoster();
    private stagedTeammateRoster = new MatchRoster<MatchRosterTeammate>();
    private readonly _unsubscribe = new Subject<void>();

    constructor(private readonly match: MatchService, private readonly overwolf: OverwolfDataProviderService) {}

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public start(): void {
        this.setupMatchStart();
        this.setupMatchReset();
        this.setupCounts();
        this.setupMatchRoster();
        this.setupTeammateRoster();
    }

    /**
     * Resets states and emits rosters
     */
    private setupMatchStart(): void {
        this.match.startedEvent$.pipe(takeUntil(this._unsubscribe)).subscribe(() => {
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
    private setupMatchReset(): void {
        this.match.endedEvent$.pipe(takeUntil(this._unsubscribe)).subscribe(() => {
            this.resetStagedRosters();
        });
    }

    /**
     * Update teams/players counters
     */
    private setupCounts(): void {
        this.overwolf.infoUpdates$
            .pipe(
                takeUntil(this._unsubscribe),
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
     * Does not update the roster after the match starts.
     */
    private setupMatchRoster(): void {
        this.overwolf.infoUpdates$
            .pipe(
                takeUntil(this._unsubscribe),
                // Should only receive roster additions prior to the match start
                filter(() => !this.match.isActive),
                filter((infoUpdate) => infoUpdate.feature === "roster"),
                map((infoUpdate) => infoUpdate.info.match_info)
            )
            .subscribe((matchInfo) => {
                const rosterKey = findKeyByKeyRegEx(matchInfo, /^roster_/);
                if (!rosterKey) return;
                const rosterItem: OWMatchInfoRoster = (matchInfo as any)[rosterKey];
                if (!rosterItem) return;

                const newRosterPlayer: MatchRosterPlayer = {
                    name: rosterItem.name,
                    rosterKey: rosterKey,
                    teamId: rosterItem.team_id,
                    platformHardware: rosterItem.platform_hw,
                    platformSoftware: rosterItem.platform_sw,
                };

                this.stagedMatchRoster.addPlayer(newRosterPlayer);
            });
    }

    private setupTeammateRoster(): void {
        this.overwolf.infoUpdates$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((infoUpdate) => infoUpdate.feature === "team"),
                map((infoUpdate) => infoUpdate.info.match_info),
                map((m) => findValueByKeyRegEx(m, /^legendSelect_/) as overwolf.gep.ApexLegends.MatchInfoLegendSelect),
                filter((legendSelect) => !isEmpty(legendSelect))
            )
            .subscribe((legendSelect) => {
                const rosterPlayer = this.stagedMatchRoster.allPlayers.find((p) => isPlayerNameEqual(p.name, legendSelect.playerName));
                const newTeammateLegend = new Legend(legendSelect.legendName);
                let newRosterTeammate: MatchRosterTeammate;

                if (rosterPlayer) newRosterTeammate = { ...rosterPlayer, legend: newTeammateLegend };
                else newRosterTeammate = { name: legendSelect.playerName, legend: newTeammateLegend };

                this.stagedTeammateRoster.addPlayer(newRosterTeammate);
            });
    }

    private resetStagedRosters(): void {
        this.stagedMatchRoster = new MatchRoster();
        this.stagedTeammateRoster = new MatchRoster<MatchRosterTeammate>();
    }
}
