import { MatchGameModePlaylist } from "#app/models/match/game-mode/game-mode-playlist.enum";
import { RawGamesPlayerService } from "#app/modules/core/raw-games/player.service";
import { RawGameLobby } from "#shared/models/raw-games/lobby";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject, takeUntil, tap } from "rxjs";

@Component({
    selector: "app-player-lobby-view",
    templateUrl: "./player-lobby-view.component.html",
    styleUrls: ["./player-lobby-view.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerLobbyViewComponent implements OnInit, OnDestroy {
    @Input() public lobby?: Optional<RawGameLobby>;
    public lobbies: RawGameLobby[] = [];

    public get playlistItems(): {
        friendlyName: string;
        playlist: MatchGameModePlaylist;
        enabled: boolean;
    }[] {
        if (!this.lobby) return [];
        const friendlyName =
            this.lobby.gameModePlaylist === MatchGameModePlaylist.Mixtape
                ? "Mixtape"
                : this.lobby.gameModePlaylist === MatchGameModePlaylist.BattleRoyale
                ? "Battle Royale"
                : "Unknown";
        return [
            {
                friendlyName,
                playlist: this.lobby.gameModePlaylist,
                enabled: false,
            },
        ];
    }

    private destroy$ = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef, private readonly rawGamesPlayer: RawGamesPlayerService) {}

    public ngOnInit(): void {
        this.loadLobbies().pipe(takeUntil(this.destroy$)).subscribe();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadLobbies(): Observable<RawGameLobby[]> {
        return this.rawGamesPlayer.getLobbies().pipe(
            tap((lobbies) => {
                this.lobbies = lobbies;
                this.cdr.detectChanges();
            })
        );
    }
}
