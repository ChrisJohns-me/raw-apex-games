import { Hotkey } from "#app/models/hotkey.js";
import { MatchGameModePlaylist } from "#app/models/match/game-mode/game-mode-playlist.enum.js";
import { MatchGameModeGenericId } from "#app/models/match/game-mode/game-mode.enum.js";
import { OverwolfWindowName } from "#app/models/overwolf-window.js";
import { GameplayInputService } from "#app/modules/core/gameplay-input.service.js";
import { OverwolfUtilsService } from "#app/modules/core/overwolf/overwolf-utils.service";
import { PlayerNameService } from "#app/modules/core/player-name.service";
import { PlayerOriginIdService } from "#app/modules/core/player-origin-id.service";
import { RawGamesOrganizerService } from "#app/modules/core/raw-games/organizer.service.js";
import { RawGameLobby } from "#shared/models/raw-games/lobby.js";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { mdiClipboardOutline, mdiEye, mdiEyeOff } from "@mdi/js";
import { Modal } from "bootstrap";
import { addDays } from "date-fns";
import { filter, Observable, Subject, switchMap, takeUntil, tap } from "rxjs";

@Component({
    selector: "app-in-game-window",
    templateUrl: "./in-game-window.component.html",
    styleUrls: ["./in-game-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InGameWindowComponent implements OnInit, OnDestroy {
    @ViewChild("controllerWarningModal") private controllerWarningModal?: ElementRef;

    /** Is the window full size? */
    public isHUDExpanded = false;

    public lobby?: Optional<RawGameLobby>;

    public mainHotkey?: Hotkey;
    public myOriginId?: Optional<string>;
    public myName?: Optional<string>;
    public isOrganizer = false;

    public readonly mdiEye = mdiEye;
    public readonly mdiEyeOff = mdiEyeOff;
    public readonly mdiClipboardOutline = mdiClipboardOutline;
    public readonly OverwolfWindowName = OverwolfWindowName;

    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly gameplayInput: GameplayInputService,
        private readonly overwolfUtils: OverwolfUtilsService,
        private readonly playerName: PlayerNameService,
        private readonly playerOriginId: PlayerOriginIdService,
        private readonly rawGamesOrganizer: RawGamesOrganizerService
    ) {
        this.loadLobbies().pipe(takeUntil(this.destroy$)).subscribe();
        this.rawGamesOrganizer.isUserOrganizer$.pipe(takeUntil(this.destroy$)).subscribe((isUserOrganizer) => {
            this.isOrganizer = isUserOrganizer; // Might be getting an assertion error here
            this.cdr.detectChanges();
        });
    }

    public ngOnInit(): void {
        this.setupMyName();
        this.setupMyOriginId();
        this.watchForController();
    }

    // TODO: Remove this
    public onTempControllerClick(): void {
        this.showControllerWarningModal(); // TODO: MOVE
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onCreateLobbyClick(): void {
        const myName = this.playerName.myName$.value;
        const myOriginId = this.playerOriginId.myOriginId$.value;
        const joinCode = "123456"; // TODO: Get from input
        if (!myName || !myOriginId) throw new Error("Missing player name or origin ID; play a Trios BR game first");
        const lobby = new RawGameLobby({
            lobbyCode: joinCode,
            gameModeGenericId: MatchGameModeGenericId.FiringRange,
            gameModePlaylist: MatchGameModePlaylist.Sandbox,
            organizerOriginId: myOriginId,
            organizerPlayerName: myName,
            playerOriginIds: [myOriginId],
            isJoinable: true,
            isStarted: false,
            startDate: new Date(),
            endDate: addDays(new Date(), 1),
        });

        this.rawGamesOrganizer
            .createLobby(lobby)
            .pipe(
                takeUntil(this.destroy$),
                tap(() => console.log("Lobby was created", lobby)),
                switchMap(() => this.loadLobbies())
            )
            .subscribe();
    }

    public onLobbyCodeChange(lobbyCode: string): void {
        // TODO: Update lobby code
    }

    public onLoadLobbiesClick(): void {
        this.loadLobbies().pipe(takeUntil(this.destroy$)).subscribe();
    }

    private loadLobbies(): Observable<RawGameLobby[]> {
        return this.rawGamesOrganizer.getLobbies().pipe(
            tap((lobbies) => {
                // this.lobbies = lobbies;
                this.lobby = lobbies[0]; // Grab the first lobby for now; TODO: Allow user to see all lobbies
                this.cdr.detectChanges();
            })
        );
    }

    private setupMyName(): void {
        this.playerName.myName$.pipe(takeUntil(this.destroy$)).subscribe((playerName) => {
            this.myName = playerName;
            this.cdr.detectChanges();
        });
    }

    private setupMyOriginId(): void {
        this.playerOriginId.myOriginId$.pipe(takeUntil(this.destroy$)).subscribe((playerOriginId) => {
            this.myOriginId = playerOriginId;
            this.cdr.detectChanges();
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
        const showBackdrop = this.isHUDExpanded; // Show backdrop only when HUD is expanded
        const getConfirmModal = () => new Modal(this.controllerWarningModal?.nativeElement, { backdrop: showBackdrop });
        this.controllerWarningModal?.nativeElement.addEventListener("hidden.bs.modal", () => {
            // Modal was closed
        });
        let confirmModal = getConfirmModal();

        if (!confirmModal) confirmModal = getConfirmModal();
        if (confirmModal) confirmModal.show();
    }
    // #endregion
}
