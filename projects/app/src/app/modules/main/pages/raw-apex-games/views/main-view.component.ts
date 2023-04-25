import { MatchGameModePlaylist } from "#app/models/match/game-mode/game-mode-playlist.enum.js";
import { RawGamesOrganizerService } from "#app/modules/core/raw-games/organizer.service.js";
import { RawGamesPlayerService } from "#app/modules/core/raw-games/player.service";
import { RawGameLobby } from "#shared/models/raw-games/lobby";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { defer, Observable, of, repeat, Subject, switchMap, takeUntil, tap } from "rxjs";

const AUTO_REFRESH_LOBBIES_INTERVAL = 60 * 1000;

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
            playlistItem.gameLobbies = lobbies.filter((lobby) => lobby.gameModePlaylist === playlistItem.playlist);
        });
    }
    public get lobbies(): RawGameLobby[] {
        return this._lobbies;
    }

    public get noLobbiesAvailable(): boolean {
        return !this._lobbies.filter((l) => l.isJoinable).length;
    }
    public isLoadingLobbies = false;

    public selectedLobby?: Optional<RawGameLobby>;
    public playlistItems: {
        friendlyName: string;
        playlist: MatchGameModePlaylist;
        gameLobbies: RawGameLobby[];
    }[] = [
        { friendlyName: "Battle Royale", playlist: MatchGameModePlaylist.BattleRoyale, gameLobbies: [] },
        { friendlyName: "Mixtape", playlist: MatchGameModePlaylist.Mixtape, gameLobbies: [] },
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
            this.isOrganizer = isUserOrganizer;
            this.cdr.detectChanges();
        });

        defer(() => this.loadLobbies())
            .pipe(takeUntil(this.destroy$), repeat({ delay: AUTO_REFRESH_LOBBIES_INTERVAL }))
            .subscribe();
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
        return of(null).pipe(
            tap(() => {
                console.debug("Refreshing lobbies");
                this.isLoadingLobbies = true;
                this.refreshUI();
            }),
            switchMap(() => this.rawGamesPlayer.getLobbies()),
            tap((lobbies) => {
                this.lobbies = lobbies;
                this.isLoadingLobbies = false;
                this.refreshUI();
            })
        );
    }

    private refreshUI(): void {
        this.cdr.detectChanges();
    }
}
