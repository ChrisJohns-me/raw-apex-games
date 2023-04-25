import { MatchGameModePlaylist } from "#app/models/match/game-mode/game-mode-playlist.enum";
import { RawGameLobby } from "#shared/models/raw-games/lobby";
import {
    AfterViewChecked,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
} from "@angular/core";
import { formatDistance } from "date-fns";
import { Subject } from "rxjs";

@Component({
    selector: "app-playlist-selector",
    templateUrl: "./playlist-selector.component.html",
    styleUrls: ["./playlist-selector.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistSelectorComponent implements AfterViewChecked, OnDestroy {
    @Input() public selectedPlaylist?: Optional<MatchGameModePlaylist>;
    @Output() public selectedPlaylistChange = new EventEmitter<Optional<MatchGameModePlaylist>>();
    @Input() public isOrganizerView = false;
    @Input() public isPlayerLobbyView = false;
    @Input() public playlistItems: {
        friendlyName: string;
        playlist: MatchGameModePlaylist;
        gameLobbies?: RawGameLobby[];
    }[] = [
        { friendlyName: "Battle Royale", playlist: MatchGameModePlaylist.BattleRoyale, gameLobbies: [] },
        { friendlyName: "Mixtape", playlist: MatchGameModePlaylist.Mixtape, gameLobbies: [] },
    ];
    public readonly MatchGameModePlaylist = MatchGameModePlaylist;

    private destroy$ = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef) {}

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public ngAfterViewChecked(): void {
        this.refreshUI();
    }

    public onPlaylistChange(playlist: MatchGameModePlaylist): void {
        this.selectedPlaylistChange.emit(playlist);
        this.refreshUI();
    }

    public isPlaylistDisabled(playlistItem: PlaylistSelectorComponent["playlistItems"][0]): boolean {
        if (this.isPlayerLobbyView) return false;
        if (this.isOrganizerView) return false;
        if (!playlistItem.gameLobbies?.filter((l) => l.isJoinable).length) return true;
        return false;
    }

    public isPlaylistSelectable(playlistItem: PlaylistSelectorComponent["playlistItems"][0]): boolean {
        if (this.isPlayerLobbyView) return false;
        if (playlistItem.gameLobbies?.filter((l) => l.isJoinable).length) return true;
        return true;
    }

    public getSubTitle(playlistItem: PlaylistSelectorComponent["playlistItems"][0]): string {
        if (this.isOrganizerView || this.isPlayerLobbyView) return "";
        const nonEndedLobbies = playlistItem.gameLobbies?.filter((l) => !l.hasEnded) ?? [];
        const joinableLobbies = nonEndedLobbies.filter((l) => l.isJoinable);

        if (nonEndedLobbies.length) {
            if (joinableLobbies.length) {
                return "Ready to Join";
            } else {
                const soonestLobby = nonEndedLobbies.reduce((prev, curr) => {
                    return (curr.startDate ?? 0) <= (prev.startDate ?? Infinity) ? curr : prev;
                }, {} as RawGameLobby);
                return `Next lobby starts in ${formatDistance(new Date(soonestLobby.startDate!), new Date())}`;
            }
        } else {
            return "No lobbies available";
        }
    }

    private refreshUI(): void {
        this.cdr.detectChanges();
    }
}
