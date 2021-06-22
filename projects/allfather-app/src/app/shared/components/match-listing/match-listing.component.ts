import { MatchGameModeList } from "@allfather-app/app/common/match/game-mode/game-mode-list";
import { Rank } from "@allfather-app/app/common/rank/rank";
import { ConfigurationService } from "@allfather-app/app/modules/core/configuration.service";
import { MatchDataStore } from "@allfather-app/app/modules/core/local-database/match-data-store";
import {
    AfterViewChecked,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    TrackByFunction,
} from "@angular/core";
import { Tooltip } from "bootstrap";
import { differenceInMilliseconds, intervalToDuration } from "date-fns";
import { interval, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { isEmpty, Stopwatch } from "shared/utilities";
import { unique } from "shared/utilities/primitives/array";
import { Legend } from "../../../common/legend/legend";
import { MatchGameMode } from "../../../common/match/game-mode/game-mode";
import { MatchMapList } from "../../../common/match/map/map-list";

const REFRESH_TIME = 1 * 60 * 1000;
const MATCH_RECENT_TIME = 3 * 60 * 1000;

type TeamRosterPlayer = NonNullable<MatchDataStore["teamRoster"]>[0];

export enum DataItem {
    MatchDate = "matchdate",
    GameMode = "gamemode",
    SquadLegends = "squadlegends",
    Map = "map",
    Eliminations = "eliminations",
    Assists = "assists",
    Knockdowns = "knockdowns",
    Placement = "placement",
    Damage = "damage",
    Rank = "rank",
}

@Component({
    selector: "app-match-listing",
    styleUrls: ["./match-listing.component.scss"],
    templateUrl: "./match-listing.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchListingComponent implements OnInit, OnDestroy, AfterViewChecked {
    @Input() public showDataItems: DataItem[] = [];
    @Input() public isLiveMatch = false;
    @Input() public set matches(value: MatchDataStore[]) {
        this._matches = value;
    }
    public get matches(): MatchDataStore[] {
        return this._matches;
    }
    @Input() public selectedMatchId? = "";
    @Input() public isMatchClickable = false;
    @Input() public isTeamRosterPlayerClickable = false;
    @Output() public matchClick = new EventEmitter<MatchDataStore>();
    @Output() public teamRosterClick = new EventEmitter<TeamRosterPlayer>();

    public DataItem = DataItem;
    public now = Date.now();
    /** Tipping point to show date played in different formats. */
    public relativeTime = 6 * 60 * 60 * 1000;

    private tooltipList: Tooltip[] = [];
    private _matches: MatchDataStore[] = [];
    private destroy$ = new Subject<void>();

    private stopwatch = new Stopwatch();
    private stopwatch2 = new Stopwatch();
    private times = {
        getRankFromScore: 0,
        getLegendName: 0,
        getLegendImageName: 0,
        getMatchMapName: 0,
        getGameModeTypeName: 0,
        buildTeamRoster: 0,
        refreshUI: 0,
    };
    constructor(private readonly cdr: ChangeDetectorRef, private readonly config: ConfigurationService) {}

    public isFunction = (value: unknown): boolean => typeof value === "function";
    public matchTrackBy: TrackByFunction<MatchDataStore> = (_, item) => item.matchId;
    public durationSinceNow = (baseDate: Date): Duration => intervalToDuration({ start: baseDate, end: new Date() });
    public getGameModeTypeName = (gameModeId: string): Optional<string> => {
        this.stopwatch.start();
        const newGameModeName = MatchGameMode.getFromId(MatchGameModeList, gameModeId).gameModeName;
        this.stopwatch.stop();
        this.times["getGameModeTypeName"] += this.stopwatch.result(false);
        this.stopwatch.clear();

        return newGameModeName;
    };
    public getMatchMapName = (matchMapId: string): Optional<string> => {
        this.stopwatch.start();
        const newMatchMapName = MatchMapList.find((m) => m.mapId === matchMapId)?.mapName;
        this.stopwatch.stop();
        this.times["getMatchMapName"] += this.stopwatch.result(false);
        this.stopwatch.clear();

        return newMatchMapName;
    };
    public getLegendImageName = (legendId?: string): string => {
        this.stopwatch.start();
        const newLegendImageName = Legend.getSquarePortraitFilename(legendId);
        this.stopwatch.stop();
        this.times["getLegendImageName"] += this.stopwatch.result(false);
        this.stopwatch.clear();

        return newLegendImageName;
    };
    public getLegendName = (legendId?: string): Optional<string> => {
        this.stopwatch.start();
        const newLegendName = Legend.getName(legendId);
        this.stopwatch.stop();
        this.times["getLegendName"] += this.stopwatch.result(false);
        this.stopwatch.clear();

        return newLegendName;
    };
    public getRankFromScore = (rankScore: number): Optional<Rank> => {
        this.stopwatch.start();
        const newRank = new Rank({ score: rankScore });
        this.stopwatch.stop();
        this.times["getRankFromScore"] += this.stopwatch.result(false);
        this.stopwatch.clear();

        return newRank;
    };
    public isRecent = (baseDate?: Date): boolean => !!baseDate && differenceInMilliseconds(new Date(), baseDate) <= MATCH_RECENT_TIME;

    public ngOnInit(): void {
        interval(REFRESH_TIME)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.refreshUI());
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public ngAfterViewChecked(): void {
        console.debug(this.times);
    }

    /**
     * Makes each legend unique.
     * Sorts and places "me" first.
     * Limits squad size to factual max squad size.
     * @returns Curated list of Match's teammates, without "me".
     */
    public buildTeamRoster(match: MatchDataStore): MatchDataStore["teamRoster"] {
        if (isEmpty(match?.teamRoster)) return [];
        this.stopwatch.start();
        const maxTeammates = this.config.facts.maxSquadSize;
        const teamRoster = unique(match.teamRoster, (p) => p.legendId);
        teamRoster.length = Math.min(teamRoster.length, maxTeammates);
        teamRoster.sort((a) => (a.isMe ? -1 : 0));

        this.stopwatch.stop();
        this.times["buildTeamRoster"] += this.stopwatch.result(false);
        this.stopwatch.clear();

        return teamRoster;
    }

    public onMatchClick(match: MatchDataStore): void {
        if (!this.isMatchClickable) return;
        this.matchClick.emit(match);
    }

    public onTeamRosterClick(teamRoster: TeamRosterPlayer): void {
        if (!this.isTeamRosterPlayerClickable) return;
        this.teamRosterClick.emit(teamRoster);
    }

    private refreshUI(): void {
        this.stopwatch2.start();
        this.cdr.detectChanges();
        this.times["refreshUI"] += this.stopwatch2.result(false);
        this.stopwatch2.stop();
        this.stopwatch2.clear();
    }
}
