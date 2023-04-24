import { MatchGameModePlaylist } from "#app/models/match/game-mode/game-mode-playlist.enum.js";
import { RawGamesOrganizerService } from "#app/modules/core/raw-games/organizer.service.js";
import { RawGamesPlayerService } from "#app/modules/core/raw-games/player.service";
import { RawGameLobby } from "#shared/models/raw-games/lobby";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { Observable, Subject, takeUntil, tap } from "rxjs";

@Component({
    selector: "app-main-view",
    templateUrl: "./main-view.component.html",
    styleUrls: ["./main-view.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainViewComponent implements OnInit, OnDestroy {
    @Output() public selectLobby = new EventEmitter<RawGameLobby>();
    @Output() public onOrganizerViewClick = new EventEmitter<void>();
    public set lobbies(lobbies: RawGameLobby[]) {
        this._lobbies = lobbies;
        this.playlistItems.forEach((playlistItem) => {
            // Only enable the playlist if there is a lobby that is joinable
            playlistItem.enabled = lobbies.some((lobby) => lobby.gameModePlaylist === playlistItem.playlist && lobby.isJoinable);
        });
    }
    public get lobbies(): RawGameLobby[] {
        return this._lobbies;
    }

    public get noLobbiesAvailable(): boolean {
        return this._lobbies.filter((l) => l.isJoinable).length === 0;
    }

    public selectedLobby?: Optional<RawGameLobby>;
    public playlistItems: {
        friendlyName: string;
        playlist: MatchGameModePlaylist;
        enabled: boolean;
    }[] = [
        { friendlyName: "Battle Royale", playlist: MatchGameModePlaylist.BattleRoyale, enabled: false },
        { friendlyName: "Mixtape", playlist: MatchGameModePlaylist.Mixtape, enabled: false },
    ];
    public isOrganizer = false;

    private _lobbies: RawGameLobby[] = [];
    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly rawGamesOrganizer: RawGamesOrganizerService,
        private readonly rawGamesPlayer: RawGamesPlayerService
    ) {}

    public ngOnInit(): void {
        this.rawGamesOrganizer.isUserOrganizer$.pipe(takeUntil(this.destroy$)).subscribe((isUserOrganizer) => {
            this.isOrganizer = isUserOrganizer; // Might be getting an assertion error here
            this.cdr.detectChanges();
        });
        this.loadLobbies().pipe(takeUntil(this.destroy$)).subscribe();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onPlaylistSelect(playlist?: Optional<MatchGameModePlaylist>): void {
        // Select the first lobby available // TODO: future list out lobbies
        const lobby = this._lobbies.find((lobby) => lobby.gameModePlaylist === playlist && lobby.isJoinable);
        this.selectLobby.emit(lobby);
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
