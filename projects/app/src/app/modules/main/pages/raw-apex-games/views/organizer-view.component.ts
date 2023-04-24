import { MatchGameModePlaylist } from "#app/models/match/game-mode/game-mode-playlist.enum";
import { PlayerNameService } from "#app/modules/core/player-name.service";
import { PlayerOriginIdService } from "#app/modules/core/player-origin-id.service";
import { RawGamesOrganizerService } from "#app/modules/core/raw-games/organizer.service";
import { RawGamesPlayerService } from "#app/modules/core/raw-games/player.service";
import { RawGameLobby } from "#shared/models/raw-games/lobby";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { filter, Observable, of, Subject, switchMap, takeUntil, tap } from "rxjs";
import { iif } from "rxjs/internal/observable/iif";

@Component({
    selector: "app-organizer-view",
    templateUrl: "./organizer-view.component.html",
    styleUrls: ["./organizer-view.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizerViewComponent implements OnInit, OnDestroy {
    public myName?: Optional<string>;
    public myOriginId?: Optional<string>;
    public myExistingLobby?: Optional<RawGameLobby>;
    public isCreating = false;
    public isUpdating = false;
    public isDeleting = false;
    public isLoadingLobby = false;
    public canCreate = false;
    public canUpdate = false;
    public canDelete = false;

    public get selectedPlaylist(): Optional<MatchGameModePlaylist> {
        return this._selectedPlaylist;
    }
    public set selectedPlaylist(value: Optional<MatchGameModePlaylist>) {
        this._selectedPlaylist = value;
        this.refreshUI();
    }
    public get lobbyCode(): string {
        return this._lobbyCode;
    }
    public set lobbyCode(value: string) {
        this._lobbyCode = value;
        this.refreshUI();
    }
    public get startDate(): Optional<Date> {
        return this._startDate;
    }
    public set startDate(value: Optional<Date>) {
        this._startDate = value;
        this.refreshUI();
    }
    public get endDate(): Optional<Date> {
        return this._endDate;
    }
    public set endDate(value: Optional<Date>) {
        this._endDate = value;
        this.refreshUI();
    }

    public get playlistItems(): {
        friendlyName: string;
        playlist: MatchGameModePlaylist;
        enabled: boolean;
    }[] {
        return [
            {
                friendlyName: "Battle Royale",
                playlist: MatchGameModePlaylist.BattleRoyale,
                enabled: true,
            },
            {
                friendlyName: "Mixtape",
                playlist: MatchGameModePlaylist.Mixtape,
                enabled: true,
            },
        ];
    }

    private _selectedPlaylist?: Optional<MatchGameModePlaylist> = MatchGameModePlaylist.Mixtape;
    private _lobbyCode = "";
    private _startDate?: Optional<Date> = new Date();
    private _endDate?: Optional<Date>;
    private get formDataValid(): boolean {
        console.log(this.myOriginId, this.selectedPlaylist, this.startDate, this.endDate);
        return !!this.myOriginId && !!this.selectedPlaylist && !!this.startDate && !!this.endDate;
    }
    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly playerName: PlayerNameService,
        private readonly playerOriginId: PlayerOriginIdService,
        private readonly rawGamesOrganizer: RawGamesOrganizerService,
        private readonly rawGamesPlayer: RawGamesPlayerService
    ) {}

    public ngOnInit(): void {
        this.setupMyData();
        this.loadMyLobby();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private setupMyData(): void {
        this.playerName.myName$
            .pipe(
                takeUntil(this.destroy$),
                filter((myName): myName is string => !!myName?.length)
            )
            .subscribe((myName) => {
                this.myName = myName;
                this.refreshUI();
            });
        this.playerOriginId.myOriginId$
            .pipe(
                takeUntil(this.destroy$),
                filter((myOriginId): myOriginId is string => !!myOriginId?.length)
            )
            .subscribe((myOriginId) => {
                this.myOriginId = myOriginId;
                this.refreshUI();
            });
    }

    public onCreateLobbyClick(): void {
        if (!this.formDataValid) throw new Error(`Form data is invalid`);
        this.isCreating = true;
        this.isUpdating = false;
        this.isDeleting = false;

        const newLobby = this.generateLobby(undefined);

        this.rawGamesOrganizer
            .createLobby(newLobby)
            .pipe(
                takeUntil(this.destroy$),
                switchMap(() => this.getMyLobby(newLobby.lobbyId))
            ) // TODO: Add catchError
            .subscribe((createdLobby) => {
                this.myExistingLobby = createdLobby;
                this.isCreating = false;
                this.refreshUI();
            });
    }

    public onUpdateLobbyClick(): void {
        if (!this.formDataValid) throw new Error(`Form data is invalid`);
        if (!this.myExistingLobby) throw new Error(`No existing lobby found`);
        this.isCreating = false;
        this.isUpdating = true;
        this.isDeleting = false;

        const updatedLobby = this.generateLobby(this.myExistingLobby.lobbyId);

        this.rawGamesOrganizer
            .updateLobby(updatedLobby)
            .pipe(
                takeUntil(this.destroy$),
                switchMap(() => this.getMyLobby(updatedLobby.lobbyId))
            ) // TODO: Add catchError
            .subscribe((updatedLobby) => {
                this.myExistingLobby = updatedLobby;
                this.isUpdating = false;
                this.refreshUI();
            });
    }

    private loadMyLobby(): void {
        this.getMyLobby()
            .pipe(takeUntil(this.destroy$))
            .subscribe((lobby) => {
                this.myExistingLobby = lobby;
                this.refreshUI();
            });
    }

    private generateLobby(lobbyId?: Optional<string>): RawGameLobby {
        return new RawGameLobby({
            lobbyId: lobbyId,
            gameModePlaylist: this.selectedPlaylist!,
            lobbyCode: this.lobbyCode,
            startDate: this.startDate!,
            endDate: this.endDate!,
            organizerOriginId: this.myOriginId!,
            organizerPlayerName: this.myName!,
            isJoinable: true,
            isStarted: false,
        });
    }

    /**
     * Attempts to get the lobby using Lobby ID, if provided, otherwise uses Origin ID.
     */
    private getMyLobby(id?: Optional<string>): Observable<Optional<RawGameLobby>> {
        const setIsLoadingLobby = (isLoading: boolean) => {
            this.isLoadingLobby = isLoading;
            this.refreshUI();
        };
        const getByLobbyIdObs = (id: string) => this.rawGamesPlayer.getLobbyByLobbyId(id);
        const getByOriginIdObs = () =>
            this.playerOriginId.myOriginId$.pipe(
                filter((originId): originId is string => !!originId?.length),
                switchMap((originId) => this.rawGamesPlayer.getLobbyByOriginId(originId))
            );

        return of(null).pipe(
            tap(() => setIsLoadingLobby(true)),
            switchMap(() => iif(() => !!id?.length, getByLobbyIdObs(id!), getByOriginIdObs())),
            tap(() => setIsLoadingLobby(false))
        );
    }

    private refreshUI(): void {
        this.canCreate = !this.myExistingLobby && !!this.formDataValid;
        this.canUpdate = !!this.myExistingLobby && !!this.formDataValid;
        this.canDelete = !!this.myExistingLobby;
        this.cdr.detectChanges();
    }
}
