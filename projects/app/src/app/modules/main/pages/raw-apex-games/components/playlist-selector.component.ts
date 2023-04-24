import { MatchGameModePlaylist } from "#app/models/match/game-mode/game-mode-playlist.enum";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output } from "@angular/core";
import { Subject } from "rxjs";

@Component({
    selector: "app-playlist-selector",
    templateUrl: "./playlist-selector.component.html",
    styleUrls: ["./playlist-selector.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistSelectorComponent implements OnDestroy {
    @Input() public selectedPlaylist?: Optional<MatchGameModePlaylist>;
    @Output() public selectedPlaylistChange = new EventEmitter<Optional<MatchGameModePlaylist>>();

    @Input() public playlistItems: {
        friendlyName: string;
        playlist: MatchGameModePlaylist;
        enabled: boolean;
    }[] = [
        { friendlyName: "Battle Royale", playlist: MatchGameModePlaylist.BattleRoyale, enabled: false },
        { friendlyName: "Mixtape", playlist: MatchGameModePlaylist.Mixtape, enabled: false },
    ];
    public readonly MatchGameModePlaylist = MatchGameModePlaylist;

    private destroy$ = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef) {}

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
