import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Subject, combineLatest, filter, map, merge, takeUntil } from "rxjs";
import { Hotkey, HotkeyEnum } from "../../../common/hotkey";
import { MatchGameMode } from "../../../common/match/game-mode/game-mode";
import { MatchMap } from "../../../common/match/map/match-map";
import { OverwolfWindowName } from "../../../common/overwolf-window";
import { HotkeyService } from "../../background/hotkey.service";
import { GameplayInputService } from "../../core/gameplay-input.service";
import { MatchService } from "../../core/match/match.service";
import { RawGamesOrganizerService } from "../../core/raw-games/organizer.service";

const MAIN_HOTKEY_NAME = HotkeyEnum.ToggleMainInGame;

@Component({
    selector: "app-in-game-window",
    templateUrl: "./in-game-window.component.html",
    styleUrls: ["./in-game-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InGameWindowComponent implements OnInit, OnDestroy {
    public isControllerDetected = false;

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
        this.rawGamesOrganizer
            .getLobbies()
            .pipe(takeUntil(this.destroy$))
            .subscribe((lobbies) => {
                console.log(lobbies);
            });
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
