import { MatchGameModePlaylist } from "#app/models/match/game-mode/game-mode-playlist.enum";
import { RawGamesPlayerService } from "#app/modules/core/raw-games/player.service";
import { RawGameLobby } from "#shared/models/raw-games/lobby";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit } from "@angular/core";
import { formatDistance } from "date-fns";
import { defer, Observable, of, repeat, Subject, switchMap, takeUntil, tap } from "rxjs";

const AUTO_REFRESH_LOBBY_INTERVAL = 60 * 1000;

@Component({
    selector: "app-player-lobby-view",
    templateUrl: "./player-lobby-view.component.html",
    styleUrls: ["./player-lobby-view.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerLobbyViewComponent implements OnInit, OnChanges, OnDestroy {
    @Input() public lobby?: Optional<RawGameLobby>;
    public lobbyCodeDate = new Date();
    public isLoadingLobby = false;

    public get timeUntilLobbyEnds(): string {
        if (!this.lobby?.endDate) return "";
        return formatDistance(this.lobby.endDate, new Date(), { addSuffix: true });
    }
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

    private originalLobbyId?: Optional<RawGameLobby["lobbyId"]>;
    private destroy$ = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef, private readonly rawGamesPlayer: RawGamesPlayerService) {}

    public ngOnInit(): void {
        defer(() => this.loadLobby())
            .pipe(takeUntil(this.destroy$), repeat({ delay: AUTO_REFRESH_LOBBY_INTERVAL }))
            .subscribe();
    }

    public ngOnChanges(): void {
        this.originalLobbyId = this.lobby?.lobbyId;
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadLobby(): Observable<Optional<RawGameLobby>> {
        const lobbyId = this.originalLobbyId ?? this.lobby?.lobbyId;
        console.debug("loadLobby", lobbyId);
        if (!lobbyId) return of(undefined);
        return of(null).pipe(
            tap(() => {
                console.debug("Refreshing lobby");
                this.isLoadingLobby = true;
                this.refreshUI();
            }),
            switchMap(() => this.rawGamesPlayer.getLobbyByLobbyId(lobbyId)),
            tap((lobby) => {
                this.lobbyCodeDate = lobby?.lobbyCode !== this.lobby?.lobbyCode ? new Date() : this.lobbyCodeDate;
                this.lobby = lobby;
                this.isLoadingLobby = false;
                this.refreshUI();
            })
        );
    }

    private refreshUI(): void {
        this.cdr.detectChanges();
    }
}
