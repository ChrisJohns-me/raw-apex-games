import { ConfigurationService } from "@allfather-app/app/modules/core/configuration/configuration.service";
import { MatchDataStore } from "@allfather-app/app/modules/core/local-database/match-data-store";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TrackByFunction } from "@angular/core";
import { intervalToDuration } from "date-fns";
import { isEmpty } from "shared/utilities";
import { unique } from "shared/utilities/primitives/array";
import { Legend } from "../models/legend";
import { MatchGameMode } from "../models/match/game-mode";

@Component({
    selector: "app-match-listing",
    styleUrls: ["./match-listing.component.scss"],
    templateUrl: "./match-listing.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchListingComponent {
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

    public matchTrackBy: TrackByFunction<MatchDataStore> = (_, item): string => item.matchId;
    public durationSinceNow = (baseDate: Date): Duration => intervalToDuration({ start: baseDate, end: new Date() });
    public getGameModeTypeName = (gameModeId: string): Optional<string> => MatchGameMode.getBaseType(gameModeId);
    public getLegendImageName = (legendId: string): string => Legend.getSquarePortraitFilename(legendId);

    /**
     * @returns List of Match's teammates, without "me".
     */
    public buildTeamRoster(match: MatchDataStore): MatchDataStore["teamRoster"] {
        if (isEmpty(match?.teamRoster)) return [];
        const maxTeammates = this.config.facts.maxSquadSize - 1;
        const teamRoster = unique(match.teamRoster, (p) => p.legendId)
            .filter((p) => !p.isMe)
            .filter((p) => p.legendId !== match.legendId);
        teamRoster.length = Math.min(teamRoster.length, maxTeammates);

        return teamRoster;
    }
}
