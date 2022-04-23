import { Hotkey, HotkeyEnum } from "@allfather-app/app/common/hotkey";
import { MatchGameMode } from "@allfather-app/app/common/match/game-mode/game-mode";
import { MatchMap } from "@allfather-app/app/common/match/map/match-map";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { combineLatest, filter, map, merge, Subject, takeUntil } from "rxjs";
import { HotkeyService } from "../../background/hotkey.service";
import { MapRotationService } from "../../core/map-rotation/map-rotation.service";
import { MatchService } from "../../core/match/match.service";

const MAIN_HOTKEY_NAME = HotkeyEnum.ToggleMain;

@Component({
    selector: "app-lobby-status-window",
    templateUrl: "./lobby-status-window.component.html",
    styleUrls: ["./lobby-status-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LobbyStatusWindowComponent implements OnInit, OnDestroy {
    public get isGameModeSupported(): boolean {
        return !!this.gameMode?.isAFSupported && !!this.gameMode?.isReportable && !!this.gameMode?.isActive;
    }

    public get isMapSupported(): boolean {
        return !!this.matchMap?.isChartable && !!this.matchMap?.isActive;
    }

    public gameMode?: MatchGameMode;
    public matchMap?: MatchMap;
    public mainHotkey?: Hotkey;

    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly hotkey: HotkeyService,
        private readonly mapRotation: MapRotationService,
        private readonly match: MatchService
    ) {}

    public ngOnInit(): void {
        this.setupHotkeys();
        this.setupGameModeAndMapRotation();
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

    private setupGameModeAndMapRotation(): void {
        combineLatest([
            this.match.gameMode$,
            this.mapRotation.mapRotation$, // Also update the map when the map rotation changes
        ])
            .pipe(
                takeUntil(this.destroy$),
                map(([gameMode]) => gameMode)
            )
            .subscribe((gameMode) => {
                this.gameMode = gameMode;
                this.matchMap = gameMode ? this.mapRotation.getCurrentMapFromGameMode(gameMode?.gameModeGenericId) : undefined;
                this.cdr.detectChanges();
            });
    }
}
