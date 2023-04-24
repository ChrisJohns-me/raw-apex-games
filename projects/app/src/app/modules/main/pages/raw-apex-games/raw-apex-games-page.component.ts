import { Hotkey } from "#app/models/hotkey.js";
import { MatchGameModePlaylist } from "#app/models/match/game-mode/game-mode-playlist.enum.js";
import { OverwolfWindowName } from "#app/models/overwolf-window.js";
import { GameplayInputService } from "#app/modules/core/gameplay-input.service.js";
import { PlayerNameService } from "#app/modules/core/player-name.service";
import { PlayerOriginIdService } from "#app/modules/core/player-origin-id.service";
import { RawGamesOrganizerService } from "#app/modules/core/raw-games/organizer.service.js";
import { RawGameLobby } from "#shared/models/raw-games/lobby.js";
import {
    AfterViewChecked,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from "@angular/core";
import { mdiArrowLeft } from "@mdi/js";
import { Modal } from "bootstrap";
import { filter, Subject, takeUntil } from "rxjs";
import { RawApexGamesView } from "./views/raw-apex-games-view.enum.js";

@Component({
    selector: "app-raw-apex-games-page",
    templateUrl: "./raw-apex-games-page.component.html",
    styleUrls: ["./raw-apex-games-page.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RawApexGamesPageComponent implements OnInit, AfterViewChecked, OnDestroy {
    @ViewChild("controllerWarningModal") private controllerWarningModal?: ElementRef;

    public selectedLobby?: Optional<RawGameLobby>;
    public selectedPlayList?: Optional<MatchGameModePlaylist>;
    public mainHotkey?: Hotkey;
    public hasRequiredData = false;
    public isOrganizer = false;

    public view = RawApexGamesView.Main;

    public readonly RawApexGamesView = RawApexGamesView;
    public readonly OverwolfWindowName = OverwolfWindowName;
    public readonly mdiArrowLeft = mdiArrowLeft;

    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly gameplayInput: GameplayInputService,
        private readonly playerName: PlayerNameService,
        private readonly playerOriginId: PlayerOriginIdService,
        private readonly rawGamesOrganizer: RawGamesOrganizerService
    ) {}

    public ngOnInit(): void {
        this.setupRequiredData();
        this.watchForController();
        this.rawGamesOrganizer.isUserOrganizer$.pipe(takeUntil(this.destroy$)).subscribe((isUserOrganizer) => {
            this.isOrganizer = isUserOrganizer;
            this.refreshUI();
        });
    }

    public ngAfterViewChecked(): void {
        this.refreshUI();
    }

    // TODO: Remove this
    public onTempControllerClick(): void {
        this.showControllerWarningModal(); // TODO: MOVE
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onSelectLobby(lobby: RawGameLobby): void {
        this.selectedLobby = lobby;
        this.view = RawApexGamesView.PlayerLobby;
    }

    private setupRequiredData(): void {
        this.playerOriginId.myOriginId$
            .pipe(
                takeUntil(this.destroy$),
                filter((originId): originId is string => !!originId?.length)
            )
            .subscribe((originId) => {
                this.hasRequiredData = !!originId;
            });
    }

    // #region Controller
    private watchForController(): void {
        this.gameplayInput.isMouseInputDetectedOnDamageBurst$
            .pipe(
                takeUntil(this.destroy$),
                filter((isMouseDetected) => isMouseDetected !== undefined)
            )
            .subscribe(() => this.showControllerWarningModal());
    }

    private showControllerWarningModal(): void {
        const getConfirmModal = () => new Modal(this.controllerWarningModal?.nativeElement);
        this.controllerWarningModal?.nativeElement.addEventListener("hidden.bs.modal", () => {
            // Modal was closed
        });
        let confirmModal = getConfirmModal();

        if (!confirmModal) confirmModal = getConfirmModal();
        if (confirmModal) confirmModal.show();
    }
    // #endregion

    private refreshUI(): void {
        this.cdr.detectChanges();
    }
}
