import { ConfigurationService } from "@allfather-app/app/modules/core/configuration.service";
import { MatchDataStore } from "@allfather-app/app/modules/core/local-database/match-data-store";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TrackByFunction } from "@angular/core";
import { intervalToDuration } from "date-fns";
import { isEmpty } from "shared/utilities";
import { unique } from "shared/utilities/primitives/array";
import { Legend } from "../../../common/legend";
import { MatchGameMode } from "../../../common/match/game-mode";
import { MatchMapList } from "../../../common/match/map/map-list";

@Component({
    selector: "app-match-listing",
    styleUrls: ["./match-listing.component.scss"],
    templateUrl: "./match-listing.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchListingComponent {
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

    public now = Date.now();
    /** Tipping point to show date played in different formats. */
    public relativeTime = 6 * 60 * 60 * 1000;

    private _matches: MatchDataStore[] = [];

    constructor(private readonly config: ConfigurationService) {}

    public isFunction = (value: unknown): boolean => typeof value === "function";
    public matchTrackBy: TrackByFunction<MatchDataStore> = (_, item) => item.matchId;
    public durationSinceNow = (baseDate: Date): Duration => intervalToDuration({ start: baseDate, end: new Date() });
    public getGameModeTypeName = (gameModeId: string): Optional<string> => MatchGameMode.getBaseType(gameModeId);
    public getMatchMapName = (matchMapId: string): Optional<string> => MatchMapList.find((m) => m.mapId === matchMapId)?.mapName;
    public getLegendImageName = (legendId?: string): string => Legend.getSquarePortraitFilename(legendId);

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
}
