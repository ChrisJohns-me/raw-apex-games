import { MatchGameModeList } from "@allfather-app/app/common/match/game-mode/game-mode-list";
import { Rank } from "@allfather-app/app/common/rank/rank";
import { ConfigurationService } from "@allfather-app/app/modules/core/configuration.service";
import { MatchDataStore } from "@allfather-app/app/modules/core/local-database/match-data-store";
import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, TrackByFunction } from "@angular/core";
import { Tooltip } from "bootstrap";
import { intervalToDuration } from "date-fns";
import { isEmpty } from "shared/utilities";
import { unique } from "shared/utilities/primitives/array";
import { Legend } from "../../../common/legend/legend";
import { MatchGameMode } from "../../../common/match/game-mode/game-mode";
import { MatchMapList } from "../../../common/match/map/map-list";

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
export class MatchListingComponent implements AfterViewInit, OnChanges {
    @Input() public showDataItems: DataItem[] = [];
    @Input() public isLiveMatch = false;
    @Input() public set matches(value: MatchDataStore[]) {
        this._matches = value;
    }
    public get matches(): MatchDataStore[] {
        return this._matches;
    }
    @Input() public selectedMatchId? = "";
    @Input() public isSelectable = false;
    @Output() public matchClick = new EventEmitter<MatchDataStore>();

    public DataItem: typeof DataItem = DataItem;
    public now = Date.now();
    /** Tipping point to show date played in different formats. */
    public relativeTime = 6 * 60 * 60 * 1000;

    private _matches: MatchDataStore[] = [];

    constructor(private readonly config: ConfigurationService) {}

    public isFunction = (value: unknown): boolean => typeof value === "function";
    public matchTrackBy: TrackByFunction<MatchDataStore> = (_, item) => item.matchId;
    public durationSinceNow = (baseDate: Date): Duration => intervalToDuration({ start: baseDate, end: new Date() });
    public getGameModeTypeName = (gameModeId: string): Optional<string> =>
        MatchGameMode.getFromId(MatchGameModeList, gameModeId).gameModeName;
    public getMatchMapName = (matchMapId: string): Optional<string> => MatchMapList.find((m) => m.mapId === matchMapId)?.mapName;
    public getLegendImageName = (legendId?: string): string => Legend.getSquarePortraitFilename(legendId);
    public getLegendName = (legendId?: string): Optional<string> => Legend.getName(legendId);
    public getRankFromScore = (rankScore: number): Optional<Rank> => new Rank({ score: rankScore });

    public ngAfterViewInit(): void {}

    public ngOnChanges(): void {
        setTimeout(() => this.enableBSTooltips(), 1000);
    }

    /**
     * Makes each legend unique.
     * Sorts and places "me" first.
     * Limits squad size to factual max squad size.
     * @returns Curated list of Match's teammates, without "me".
     */
    public buildTeamRoster(match: MatchDataStore): MatchDataStore["teamRoster"] {
        if (isEmpty(match?.teamRoster)) return [];
        const maxTeammates = this.config.facts.maxSquadSize;
        const teamRoster = unique(match.teamRoster, (p) => p.legendId);
        teamRoster.length = Math.min(teamRoster.length, maxTeammates);
        teamRoster.sort((a) => (a.isMe ? -1 : 0));
        return teamRoster;
    }

    private enableBSTooltips(): void {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new Tooltip(tooltipTriggerEl);
        });
    }
}
