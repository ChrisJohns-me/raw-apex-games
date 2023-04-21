import { environment } from "#app/../environments/environment.js";
import { APP_NAME } from "#app/models/app.js";
import { OverwolfWindow, OverwolfWindowName, OverwolfWindowState } from "#app/models/overwolf-window.js";
import { SettingKey } from "#app/models/settings.js";
import { GoogleAnalyticsService } from "#app/modules/core/google-analytics.service.js";
import { OverwolfGameDataService } from "#app/modules/core/overwolf/index.js";
import { SettingsService } from "#app/modules/core/settings.service.js";
import { MainPage } from "#app/modules/desktop/pages/main-page.js";
import { DesktopWindowService } from "#app/modules/desktop/windows/desktop-window.service.js";
import { InGameWindowService } from "#app/modules/in-game/windows/in-game-window.service.js";
import { isEmpty } from "#shared/utilities/primitives/boolean.js";
import { mathClamp } from "#shared/utilities/primitives/math.js";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from "@angular/core";
import { Title } from "@angular/platform-browser";
import { mdiCogOutline, mdiWindowClose, mdiWindowMaximize, mdiWindowMinimize, mdiWindowRestore } from "@mdi/js";
import { Observable, Subject } from "rxjs";
import { filter, finalize, map, shareReplay, switchMap, take, takeUntil, tap } from "rxjs/operators";

export type ConfigPositionXAnchor = "left" | "center" | "right";
export type ConfigPositionYAnchor = "top" | "middle" | "bottom";

type WindowPositionInput = {
    xPercent: number;
    yPercent: number;
    xAnchor: ConfigPositionXAnchor;
    yAnchor: ConfigPositionYAnchor;
};

type WindowSizeInput = {
    minWidthPercent?: number;
    minHeightPercent?: number;
    widthPercent: number;
    heightPercent: number;
};

const TITLE_SUFFIX = " (Beta)";

@Component({
    selector: "app-ui-container",
    templateUrl: "./ui-container.component.html",
    styleUrls: ["./ui-container.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UIContainerComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
    @Input() public set overwolfWindowName(value: Optional<OverwolfWindowName>) {
        if (value) this.overwolfWindow.name = value;
    }
    @Input() public injectBootstrapCSS = false;
    @Input() public resolutionZoom = true;
    @Input() public isContentDraggable = true;
    @Input() public isDesktopWindow = true;
    @Input() public isTitlebarDraggable = true;
    @Input() public isMaximizable = true;
    @Input() public isMinimizable = true;
    @Input() public position?: WindowPositionInput;
    /**
     * If min/max are not set, default to the width/height percent.
     * Overwolf windows are at least must be at least 100px width or height.
     * */
    @Input() public size?: WindowSizeInput;
    @Input() public set primaryTitle(value: string) {
        this.titleService.setTitle(value ? `${value} - ${APP_NAME}${TITLE_SUFFIX}` : `${APP_NAME}${TITLE_SUFFIX}`);
        this._primaryTitle = value;
    }
    public get primaryTitle(): string {
        return this._primaryTitle ? `${APP_NAME} - ${this._primaryTitle}${TITLE_SUFFIX}` : `${APP_NAME}${TITLE_SUFFIX}`;
    }
    @Input() public secondaryTitle = "";
    @Input() public enablePageviewTracking = true;
    /** If function is not provided, the window will be closed */
    @Input("onCloseButtonClick") public onCloseFn?: () => void;
    @Input() public showSettingsLink = false;

    public state: OverwolfWindowState = OverwolfWindowState.Normal;
    public isDev = environment.DEV;
    public WindowState = OverwolfWindowState;
    public mdiCogOutline = mdiCogOutline;
    public mdiWindowMinimize = mdiWindowMinimize;
    public mdiWindowMaximize = mdiWindowMaximize;
    public mdiWindowRestore = mdiWindowRestore;
    public mdiWindowClose = mdiWindowClose;

    private readonly overwolfWindow = new OverwolfWindow();
    private _primaryTitle = "";
    private obtained$?: Observable<boolean>;
    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly googleAnalytics: GoogleAnalyticsService,
        private readonly desktopWindow: DesktopWindowService,
        private readonly inGameWindow: InGameWindowService,
        private readonly overwolfGameData: OverwolfGameDataService,
        private readonly settings: SettingsService,
        private readonly titleService: Title
    ) {
        this.titleService.setTitle(APP_NAME);
    }

    public ngOnInit(): void {
        this.obtained$ = this.overwolfWindow.assureObtained().pipe(
            map(() => true),
            shareReplay(1)
        );
    }

    public ngAfterViewInit(): void {
        this.setupPageviewTracking();
        this.setupDefaultSize();
        this.setupDefaultPosition();
        this.getState()
            .pipe(
                takeUntil(this.destroy$),
                finalize(() => this.cdr.detectChanges())
            )
            .subscribe();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        const gameInfo = this.overwolfGameData.gameInfo$.value;
        if (gameInfo) this.onResolutionChange(gameInfo);

        if (changes.position) {
            this.updatePosition();
        }
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onSettingsButtonClick(): void {
        this.desktopWindow.goToPage(MainPage.Settings);
    }

    public onMinimizeButtonClick(): void {
        if (!this.isMinimizable) return;

        this.settings
            .getSetting$<boolean>(SettingKey.MinimizeToTray)
            .pipe(
                takeUntil(this.destroy$),
                map((minimizeToTraySetting) => minimizeToTraySetting?.value ?? false)
            )
            .subscribe((minimizeToTray) => {
                if (minimizeToTray) this.close();
                else this.minimizeToggle();
            });
    }

    public onMaximizeButtonClick(): void {
        if (!this.isMaximizable) return;
        this.maximizeToggle();
    }

    public onCloseButtonClick(): void {
        if (typeof this.onCloseFn === "function") {
            this.onCloseFn();
        } else {
            this.close();
        }
    }

    public onTitlebarMouseDown(event: Event): void {
        if (!this.isTitlebarDraggable) return;
        if (!(event instanceof MouseEvent)) return;
        this.onDrag(event);
    }

    public onTitlebarDoubleClick(event: Event): void {
        if (!this.isMaximizable) return;
        if (!(event instanceof MouseEvent)) return;
        this.maximizeToggle();
    }

    public onContentMouseDown(event: Event): void {
        if (!this.isContentDraggable) return;
        if (!(event instanceof MouseEvent)) return;
        this.onDrag(event);
    }

    private setupPageviewTracking(): void {
        OverwolfWindow.getCurrentWindow()
            .pipe(
                takeUntil(this.destroy$),
                filter(() => this.enablePageviewTracking),
                map((winInfo) => winInfo.name),
                filter((windowName) => !isEmpty(windowName)),
                take(1)
            )
            .subscribe((windowName) => {
                const title = !isEmpty(this.primaryTitle) ? this.primaryTitle : windowName;
                const path = `/${windowName}`;
                this.googleAnalytics.sendPageview(title, path);
            });
    }

    private setupDefaultSize(): void {
        this.overwolfWindow
            .getMonitor()
            .pipe(takeUntil(this.destroy$))
            .subscribe((monitor) => {
                if (this.size) {
                    this.setMinSizeByPercent(monitor.width, monitor.height, this.size.minWidthPercent, this.size.minHeightPercent);
                    this.setSizeByPercent(monitor.width, monitor.height, this.size.widthPercent, this.size.heightPercent);
                }
            });
    }

    private setupDefaultPosition(): void {
        this.overwolfGameData.gameInfo$.pipe(takeUntil(this.destroy$)).subscribe((gameInfo) => {
            if (!gameInfo) return;
            this.onResolutionChange(gameInfo);
            this.updatePosition();
        });
    }

    private getState(): Observable<OverwolfWindowState> {
        return this.overwolfWindow.getState().pipe(tap((winState) => (this.state = winState)));
    }

    private onDrag(event: MouseEvent): void {
        const target = event.target as HTMLInputElement;
        if (target?.tagName === "INPUT") {
            return;
        }
        this.obtained$?.pipe(takeUntil(this.destroy$)).subscribe(() => this.overwolfWindow.dragMove());
    }

    private minimizeToggle(): void {
        this.overwolfWindow
            .toggleMinimize()
            .pipe(
                takeUntil(this.destroy$),
                switchMap(() => this.getState()),
                finalize(() => this.cdr.detectChanges())
            )
            .subscribe();
    }

    private maximizeToggle(): void {
        this.overwolfWindow
            .toggleMaximize()
            .pipe(
                takeUntil(this.destroy$),
                switchMap(() => this.getState()),
                finalize(() => this.cdr.detectChanges())
            )
            .subscribe();
    }

    private close(): void {
        this.obtained$
            ?.pipe(
                takeUntil(this.destroy$),
                switchMap(() => this.overwolfWindow.close())
            )
            .subscribe();
    }

    /**
     * @todo Move this into Overwolf Window Service after refactor
     */
    private onResolutionChange(gameInfo: overwolf.games.RunningGameInfo): void {
        if (!this.size) return;
        this.setSizeByPercent(gameInfo.logicalWidth, gameInfo.logicalHeight, this.size.widthPercent, this.size.heightPercent);
    }

    /**
     * Sets the window size to the pixel value from the given `width` and `height` percentage values.
     * Accounts for DPI
     */
    private setSizeByPercent(screenWidth: number, screenHeight: number, widthPercent: number, heightPercent: number): void {
        const widthPercentClamp = mathClamp(widthPercent, 0, 1);
        const heightPercentClamp = mathClamp(heightPercent, 0, 1);
        const widthPixel = Math.round(screenWidth * widthPercentClamp);
        const heightPixel = Math.round(screenHeight * heightPercentClamp);

        if (isEmpty(this.overwolfWindow.name)) {
            console.warn(`[${this.constructor.name}] Unable to setSizeByPercent; window name is empty`);
            return;
        }
        console.log(
            `Setting "${this.overwolfWindow.name}" size to: ${widthPixel}px (${widthPercentClamp * 100}%) width,  ` +
                `${heightPixel}px (${heightPercentClamp * 100}%) height`
        );
        this.overwolfWindow.changeSize(widthPixel, heightPixel).pipe(takeUntil(this.destroy$)).subscribe();
    }

    /**
     * If width/height are undefined, defaults to 1px
     */
    private setMinSizeByPercent(screenWidth: number, screenHeight: number, widthPercent?: number, heightPercent?: number): void {
        let widthPixel = 1;
        let heightPixel = 1;
        let widthPercentClamp;
        let heightPercentClamp;
        if (widthPercent) {
            widthPercentClamp = mathClamp(widthPercent, 0, 1);
            widthPixel = Math.round(screenWidth * widthPercentClamp);
        }
        if (heightPercent) {
            heightPercentClamp = mathClamp(heightPercent, 0, 1);
            heightPixel = Math.round(screenHeight * heightPercentClamp);
        }

        if (isEmpty(this.overwolfWindow.name)) {
            console.error(`[${this.constructor.name}] Unable to setSizeByPercent; window name is empty`);
            return;
        }

        console.log(
            `Setting "${this.overwolfWindow.name}" MIN size to: ${widthPixel}px ${
                widthPercentClamp ? widthPercentClamp * 100 + "% " : ""
            }width,  ` + `${heightPixel}px ${heightPercentClamp ? heightPercentClamp * 100 + "% " : ""}height`
        );
        this.overwolfWindow.setMinSize(widthPixel, heightPixel).pipe(takeUntil(this.destroy$)).subscribe();
    }

    private updatePosition(): void {
        if (!this.position) return;
        const screenSize = { height: 0, width: 0 };
        const windowSize = { height: 0, width: 0 };
        this.overwolfWindow
            .getMonitor()
            .pipe(
                takeUntil(this.destroy$),
                tap((monitor) => {
                    screenSize.height = monitor.height;
                    screenSize.width = monitor.width;
                }),
                switchMap(() => this.overwolfWindow.getSize()),
                tap((_windowSize) => {
                    windowSize.height = _windowSize.height;
                    windowSize.width = _windowSize.width;
                }),
                map(() => toTopLeftFn(this.position!, screenSize, windowSize)),
                switchMap((newPos) => this.overwolfWindow.changePosition(newPos.left, newPos.top)),
                finalize(() => this.cdr.detectChanges())
            )
            .subscribe();
    }
}

function toTopLeftFn(
    positionInput: WindowPositionInput,
    screenSize: { width: number; height: number },
    windowSize: { width: number; height: number }
): { left: number; top: number } {
    const xPixel = screenSize.width * positionInput.xPercent;
    const yPixel = screenSize.height * positionInput.yPercent;

    const topLeftPos = { left: xPixel, top: yPixel };
    const windowCenterX = windowSize.width / 2;
    const windowCenterY = windowSize.height / 2;
    const screenCenterX = screenSize.width / 2;
    const screenCenterY = screenSize.height / 2;
    if (positionInput.xAnchor === "right") topLeftPos.left = screenSize.width - windowSize.width + topLeftPos.left;
    else if (positionInput.xAnchor === "center") topLeftPos.left = screenCenterX - windowCenterX + topLeftPos.left;
    if (positionInput.yAnchor === "bottom") topLeftPos.top = screenSize.height - windowSize.height + topLeftPos.top;
    else if (positionInput.yAnchor === "middle") topLeftPos.top = screenCenterY - windowCenterY + topLeftPos.top;
    return topLeftPos;
}
