import { MatchGameModePlaylist } from "#app/models/match/game-mode/game-mode-playlist.enum";
import { PlayerNameService } from "#app/modules/core/player-name.service";
import { PlayerOriginIdService } from "#app/modules/core/player-origin-id.service";
import { RawGamesOrganizerService } from "#app/modules/core/raw-games/organizer.service";
import { RawGamesPlayerService } from "#app/modules/core/raw-games/player.service";
import { RawGameLobby } from "#shared/models/raw-games/lobby";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Modal } from "bootstrap";
import { format, isValid } from "date-fns";
import { filter, Subject, switchMap, takeUntil } from "rxjs";

@Component({
    selector: "app-organizer-view",
    templateUrl: "./organizer-view.component.html",
    styleUrls: ["./organizer-view.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizerViewComponent implements OnInit, OnDestroy {
    @ViewChild("basicModal") private basicModal?: ElementRef;

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
    public basicModalData: {
        title: string;
        message: string;
        closeBtnText: string;
    } = {
        title: "",
        message: "",
        closeBtnText: "OK",
    };

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
        this._startDate = new Date(value as Date);
        this.refreshUI();
    }
    public get endDate(): Optional<Date> {
        return this._endDate;
    }
    public set endDate(value: Optional<Date>) {
        this._endDate = new Date(value as Date);
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
    public now = new Date();

    private _selectedPlaylist?: Optional<MatchGameModePlaylist> = MatchGameModePlaylist.Mixtape;
    private _lobbyCode = "";
    private _startDate?: Optional<Date> = new Date();
    private _endDate?: Optional<Date>;
    private get formDataValid(): boolean {
        return !!this.myOriginId && !!this.selectedPlaylist && !!this.startDate && !!this.endDate;
    }
    private readonly destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly playerName: PlayerNameService,
        private readonly playerOriginId: PlayerOriginIdService,
        private readonly rawGamesOrganizer: RawGamesOrganizerService,
        private readonly rawGamesPlayer: RawGamesPlayerService
    ) {}

    public inputDateTime = (date?: Optional<Date>): Optional<string> =>
        date && isValid(date) ? format(date, "yyyy-MM-dd'T'HH:mm") : undefined;

    public ngOnInit(): void {
        this.setupMyData();
        this.loadMyLobby();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onCreateLobbyClick(): void {
        if (!this.formDataValid) throw new Error(`Form data is invalid`);
        this.isCreating = true;
        this.isUpdating = false;
        this.isDeleting = false;

        const newLobby = this.generateLobby(undefined);

        this.rawGamesOrganizer
            .createLobby(newLobby)
            .pipe(takeUntil(this.destroy$)) // TODO: Add catchError
            .subscribe((createdLobby) => {
                this.myExistingLobby = createdLobby;
                this.isCreating = false;
                this.showBasicModal("", "Lobby created");
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
            .pipe(takeUntil(this.destroy$)) // TODO: Add catchError
            .subscribe((updatedLobby) => {
                this.myExistingLobby = updatedLobby;
                this.isUpdating = false;
                // this.showBasicModal("", "Lobby updated");
                this.refreshUI();
            });
    }

    public onDeleteLobbyClick(): void {
        if (!this.myExistingLobby) throw new Error(`No existing lobby found to delete`);
        this.isCreating = false;
        this.isUpdating = false;
        this.isDeleting = true;

        const lobbyId = this.myExistingLobby.lobbyId;

        this.rawGamesOrganizer
            .deleteLobbyByLobbyId(lobbyId)
            .pipe(takeUntil(this.destroy$)) // TODO: Add catchError
            .subscribe(() => {
                this.myExistingLobby = undefined;
                this.selectedPlaylist = undefined;
                this.lobbyCode = "";
                this.startDate = undefined;
                this.endDate = undefined;
                this.isDeleting = false;
                this.showBasicModal("", "Lobby ended successfully");
                this.refreshUI();
            });
    }

    private loadMyLobby(): void {
        this.isLoadingLobby = true;
        this.playerOriginId.myOriginId$
            .pipe(
                takeUntil(this.destroy$),
                filter((originId): originId is string => !!originId?.length),
                switchMap((originId) => this.rawGamesPlayer.getLobbyByOriginId(originId))
            )
            .subscribe((existingLobby) => {
                this.isLoadingLobby = false;
                if (existingLobby) {
                    console.log("Found existing lobby", existingLobby);
                    this.myExistingLobby = existingLobby;
                    this.selectedPlaylist = existingLobby?.gameModePlaylist;
                    this.lobbyCode = existingLobby?.lobbyCode ?? "";
                    this.startDate = existingLobby?.startDate;
                    this.endDate = existingLobby?.endDate;
                }
                this.refreshUI();
            });
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

    private generateLobby(lobbyId?: Optional<string>): RawGameLobby {
        return new RawGameLobby({
            lobbyId: lobbyId,
            gameModePlaylist: this.selectedPlaylist,
            lobbyCode: this.lobbyCode,
            startDate: this.startDate,
            endDate: this.endDate,
            organizerOriginId: this.myOriginId,
            organizerPlayerName: this.myName,
            isJoinable: true,
            isStarted: false,
        });
    }

    private showBasicModal(title: string, message: string): void {
        const getBasicModal = () => new Modal(this.basicModal?.nativeElement);
        this.basicModalData = { title, message, closeBtnText: "OK" };

        let basicModal = getBasicModal();
        if (!basicModal) basicModal = getBasicModal();
        if (basicModal) basicModal.show();
    }

    private refreshUI(): void {
        this.canCreate = !this.myExistingLobby && !!this.formDataValid;
        this.canUpdate = !!this.myExistingLobby && !!this.formDataValid;
        this.canDelete = !!this.myExistingLobby;
        this.cdr.detectChanges();
    }
}
