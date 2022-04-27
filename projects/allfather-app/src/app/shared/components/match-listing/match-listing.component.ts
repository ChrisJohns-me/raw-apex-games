import { Legend } from "@allfather-app/app/common/legend/legend";
import { getLegendBGColor } from "@allfather-app/app/common/legend/legend-list";
import { MatchGameMode } from "@allfather-app/app/common/match/game-mode/game-mode";
import { MatchGameModeList } from "@allfather-app/app/common/match/game-mode/game-mode-list";
import { MatchMapList } from "@allfather-app/app/common/match/map/map-list";
import { Rank } from "@allfather-app/app/common/rank/rank";
import { ConfigurationService } from "@allfather-app/app/modules/core/configuration.service";
import { MatchDataStore } from "@allfather-app/app/modules/core/local-database/match-data-store";
import {
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
import { isEmpty } from "common/utilities/";
import { unique } from "common/utilities/primitives/array";
import { differenceInMilliseconds, intervalToDuration } from "date-fns";
import { interval, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

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
export class MatchListingComponent implements OnInit, OnDestroy {
    @Input() public numDisplayMatches = Infinity;
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

    private maxSquadSize = 3;
    private _matches: MatchDataStore[] = [];
    private destroy$ = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef, private readonly configuration: ConfigurationService) {
        this.configuration.config$.pipe(takeUntil(this.destroy$)).subscribe((config) => (this.maxSquadSize = config.brFacts.maxSquadSize));
    }

    public isFunction = (value: unknown): boolean => typeof value === "function";
    public matchTrackBy: TrackByFunction<MatchDataStore> = (_, item) => item.matchId;
    public durationSinceNow = (baseDate: Date): Duration => intervalToDuration({ start: baseDate, end: new Date() });
    public getGameModeTypeName = (gameModeId: string): Optional<string> =>
        MatchGameMode.getFromId(MatchGameModeList, gameModeId).gameModeName;
    public getMatchMapName = (matchMapId: string): Optional<string> => MatchMapList.find((m) => m.mapId === matchMapId)?.mapName;
    public getLegendImageName = (legendId?: string): string => Legend.getSquarePortraitFilename(legendId);
    public getLegendName = (legendId?: string): Optional<string> => Legend.getName(legendId);
    public getRankFromScore = (rankScore: number): Optional<Rank> => new Rank({ score: rankScore });
    public getLegendBGColor = (legendId?: string): string => getLegendBGColor(legendId);
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

    /**
     * Makes each legend unique.
     * Sorts and places "me" first.
     * Limits squad size to factual max squad size.
     * @returns {TeamRosterPlayer[]} Curated list of Match's teammates, without "me".
     */
    public buildTeamRoster(match: MatchDataStore): MatchDataStore["teamRoster"] {
        if (isEmpty(match?.teamRoster)) return [];
        const teamRoster = unique(match.teamRoster, (p) => p.legendId);
        teamRoster.length = Math.min(teamRoster.length, this.maxSquadSize);
        return teamRoster.slice().sort((a) => (a.isMe ? -1 : 0));
    }

    public onMatchClick(match: MatchDataStore): void {
        if (!this.isMatchClickable) return;
        this.matchClick.emit(match);
    }

    public onTeamRosterClick(teamRoster: TeamRosterPlayer): void {
        if (!this.isTeamRosterPlayerClickable) return;
        this.teamRosterClick.emit(teamRoster);
    }

    /** Attempts to get the rankScore difference from the given match index. */
    public getRankDiffFromMatchIndex(matchIndex: number): Optional<number> {
        const match = this.matches[matchIndex];
        if (!match?.rankScore) return;
        const olderMatches = this.matches.slice(matchIndex + 1);
        const prevMatch = olderMatches.find((m) => m.rankScore !== undefined);
        if (!prevMatch?.rankScore) return;
        return match.rankScore - prevMatch.rankScore;
    }

    private refreshUI(): void {
        this.cdr.detectChanges();
    }
}
