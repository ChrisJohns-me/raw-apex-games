import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Hotkey, HotkeyEnum } from "@app/models/hotkey.js";
import { MatchGameModePlaylist } from "@app/models/match/game-mode/game-mode-playlist.enum.js";
import { MatchGameModeGenericId } from "@app/models/match/game-mode/game-mode.enum.js";
import { MatchGameMode } from "@app/models/match/game-mode/game-mode.js";
import { MatchMap } from "@app/models/match/map/match-map.js";
import { OverwolfWindowName } from "@app/models/overwolf-window.js";
import { HotkeyService } from "@app/modules/background/hotkey.service.js";
import { GameplayInputService } from "@app/modules/core/gameplay-input.service.js";
import { MatchService } from "@app/modules/core/match/match.service.js";
import { RawGamesOrganizerService } from "@app/modules/core/raw-games/organizer.service.js";
import { RawGameLobby } from "@shared/models/raw-games/raw-game-lobby.js";
import { combineLatest, filter, map, merge, Subject, takeUntil } from "rxjs";
import { v4 as uuid } from "uuid";

const MAIN_HOTKEY_NAME = HotkeyEnum.ToggleMainInGame;

@Component({
    selector: "app-in-game-window",
    templateUrl: "./in-game-window.component.html",
    styleUrls: ["./in-game-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InGameWindowComponent implements OnInit, OnDestroy {
    public isControllerDetected = false;
    public lobbies: RawGameLobby[] = [];

    public get isGameModeSupported(): boolean {
        return !!this.gameMode?.isReportable && !this.gameMode.isSandboxGameMode;
    }

    public get isMapSupported(): boolean {
        return !!this.matchMap?.isChartable && !this.matchMap?.isSandboxMap;
    }

    public gameMode?: MatchGameMode;
    public matchMap?: MatchMap;
    public mainHotkey?: Hotkey;

    public readonly OverwolfWindowName = OverwolfWindowName;

    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly gameplayInput: GameplayInputService,
        private readonly hotkey: HotkeyService,
        private readonly match: MatchService,
        private readonly rawGamesOrganizer: RawGamesOrganizerService
    ) {
        this.onLoadLobbiesClick();
    }

    public ngOnInit(): void {
        this.setupHotkeys();
        this.setupGameMode();

        this.gameplayInput.isMouseInputDetectedOnDamageBurst$
            .pipe(
                takeUntil(this.destroy$),
                filter((isMouseDetected) => isMouseDetected !== undefined)
            )
            .subscribe((isMouseDetected) => {
                this.isControllerDetected = !isMouseDetected;
                this.cdr.detectChanges();
            });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onCreateLobbyClick(): void {
        const lobby = new RawGameLobby({
            joinCode: uuid(),
            gameModeGenericId: MatchGameModeGenericId.FiringRange,
            gameModePlaylist: MatchGameModePlaylist.Sandbox,
            organizerOriginId: "MasterKriff",
            playerOriginIds: ["MasterKriff"],
            isJoinable: true,
            isStarted: false,
        });

        this.rawGamesOrganizer
            .createLobby(lobby)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    console.log("Lobby was created", lobby);
                },
                error: (error) => {
                    console.error("LOBBY WAS NOT CREATED!", error);
                },
            });
    }

    public onLoadLobbiesClick(): void {
        this.rawGamesOrganizer
            .getLobbies()
            .pipe(takeUntil(this.destroy$))
            .subscribe((lobbies) => {
                console.log(lobbies);
            });
    }

    private setupHotkeys(): void {
        const onChanged$ = this.hotkey.onHotkeyChanged$.pipe(filter((hotkey) => hotkey.hotkeyName === MAIN_HOTKEY_NAME));

        merge(this.hotkey.getGameHotkeyByName(MAIN_HOTKEY_NAME), onChanged$)
            .pipe(takeUntil(this.destroy$))
            .subscribe((mainHotkey) => {
                this.mainHotkey = mainHotkey;
                this.cdr.detectChanges();
            });
    }

    private setupGameMode(): void {
        combineLatest([this.match.gameMode$])
            .pipe(
                takeUntil(this.destroy$),
                map(([gameMode]) => gameMode)
            )
            .subscribe((gameMode) => {
                this.gameMode = gameMode;
                // this.matchMap = gameMode ? this.mapRotation.getCurrentMapFromGameMode(gameMode?.gameModeGenericId) : undefined;
                this.cdr.detectChanges();
            });
    }
}
