import { APP_NAME } from "@allfather-app/app/common/app";
import { OverwolfGameDataService } from "@allfather-app/app/modules/core/overwolf";
import { UIWindow, WindowState } from "@allfather-app/app/modules/core/_refactor/ui-window";
import { MainPage } from "@allfather-app/app/modules/main/pages/main-page";
import { MainWindowService } from "@allfather-app/app/modules/main/windows/main-window.service";
import { ConfigPositionXAnchor, ConfigPositionYAnchor } from "@allfather-app/configs/config.interface";
import { environment } from "@allfather-app/environments/environment";
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
import { finalize, map, shareReplay, switchMap, takeUntil, tap } from "rxjs/operators";
import { mathClamp } from "shared/utilities";

type WindowPositionInput = {
    // x, y: percent
    xPercent: number;
    yPercent: number;
    xAnchor: ConfigPositionXAnchor;
    yAnchor: ConfigPositionYAnchor;
};

type WindowSizeInput = {
    // width, height: percent
    minWidthPercent?: number;
    minHeightPercent?: number;
    widthPercent: number;
    heightPercent: number;
};

@Component({
    selector: "app-ui-container",
    templateUrl: "./ui-container.component.html",
    styleUrls: ["./ui-container.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UIContainerComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
    @Input() public injectBootstrapCSS = false;
    @Input() public resolutionZoom = true;
    @Input() public isContentDraggable = true;
    @Input() public isDesktopWindow = true;
    @Input() public isTitlebarDraggable = true;
    @Input() public isMaximizable = true;
    @Input() public isMinimizable = true;
    @Input() public position?: WindowPositionInput;
    /** If min/max are not set, default to the width/height percent */
    @Input() public size?: WindowSizeInput;
    @Input() public set primaryTitle(value: string) {
        this.titleService.setTitle(value ? `${value} - ${APP_NAME}` : APP_NAME);
        this._primaryTitle = value;
    }
    public get primaryTitle(): string {
        return this._primaryTitle ? `${APP_NAME} - ${this._primaryTitle}` : APP_NAME;
    }
    @Input() public secondaryTitle = "";

    public state: WindowState = WindowState.Normal;
    public isDev = environment.DEV;
    public WindowState = WindowState;
    public mdiCogOutline = mdiCogOutline;
    public mdiWindowMinimize = mdiWindowMinimize;
    public mdiWindowMaximize = mdiWindowMaximize;
    public mdiWindowRestore = mdiWindowRestore;
    public mdiWindowClose = mdiWindowClose;

    private readonly uiWindow = new UIWindow();
    private _primaryTitle = "";
    private obtained$?: Observable<boolean>;
    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly mainWindow: MainWindowService,
        private readonly overwolfGameData: OverwolfGameDataService,
        private readonly titleService: Title
    ) {
        this.titleService.setTitle(APP_NAME);
    }

    public ngOnInit(): void {
        this.obtained$ = this.uiWindow.assureObtained().pipe(
            map(() => true),
            shareReplay(1)
        );
    }

    public ngAfterViewInit(): void {
        // Set default size (is DPI unaware)
        this.uiWindow
            .getMonitor()
            .pipe(takeUntil(this.destroy$))
            .subscribe((monitor) => {
                const standardDPI = 96;
                const dpiAdjustedWidth = (monitor.width * standardDPI) / monitor.dpiX;
                const dpiAdjustedHeight = (monitor.height * standardDPI) / monitor.dpiY;

                if (this.size) {
                    this.setMinSizeByPercent(dpiAdjustedWidth, dpiAdjustedHeight, this.size?.minWidthPercent, this.size?.minHeightPercent);
                    this.setSizeByPercent(dpiAdjustedWidth, dpiAdjustedHeight, this.size.widthPercent, this.size.heightPercent);
                }
            });

        this.overwolfGameData.gameInfo$.pipe(takeUntil(this.destroy$)).subscribe((gameInfo) => {
            if (!gameInfo) return;
            this.onResolutionChange(gameInfo);
            this.updatePosition();
        });
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
        this.mainWindow.goToPage(MainPage.Settings);
    }

    public onMinimizeButtonClick(): void {
        if (!this.isMinimizable) return;
        this.minimizeToggle();
    }

    public onMaximizeButtonClick(): void {
        if (!this.isMaximizable) return;
        this.maximizeToggle();
    }

    public onCloseButtonClick(): void {
        this.close();
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

    private getState(): Observable<WindowState> {
        return this.uiWindow.getState().pipe(tap((winState) => (this.state = winState)));
    }

    private onDrag(event: MouseEvent): void {
        const target = event.target as HTMLInputElement;
        if (target?.tagName === "INPUT") {
            return;
        }
        event.preventDefault();
        this.obtained$?.pipe(takeUntil(this.destroy$)).subscribe(() => this.uiWindow.dragMove());
    }

    private minimizeToggle(): void {
        this.uiWindow
            .toggleMinimize()
            .pipe(
                takeUntil(this.destroy$),
                switchMap(() => this.getState()),
                finalize(() => this.cdr.detectChanges())
            )
            .subscribe();
    }

    private maximizeToggle(): void {
        this.uiWindow
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
                switchMap(() => this.uiWindow.close())
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
     */
    private setSizeByPercent(screenWidth: number, screenHeight: number, widthPercent: number, heightPercent: number): void {
        const widthPercentClamp = mathClamp(widthPercent, 0, 1);
        const heightPercentClamp = mathClamp(heightPercent, 0, 1);
        const widthPixel = Math.round(screenWidth * widthPercentClamp);
        const heightPixel = Math.round(screenHeight * heightPercentClamp);

        console.log(
            `Setting "${this.uiWindow.name}" size to: ${widthPixel}px (${widthPercentClamp * 100}%) width,  ` +
                `${heightPixel}px (${heightPercentClamp * 100}%) height`
        );

        this.uiWindow.changeSize(widthPixel, heightPixel).pipe(takeUntil(this.destroy$)).subscribe();
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

        console.log(
            `Setting "${this.uiWindow.name}" MIN size to: ${widthPixel}px ${
                widthPercentClamp ? widthPercentClamp * 100 + "% " : ""
            }width,  ` + `${heightPixel}px ${heightPercentClamp ? heightPercentClamp * 100 + "% " : ""}height`
        );

        this.uiWindow.setMinSize(widthPixel, heightPixel).pipe(takeUntil(this.destroy$)).subscribe();
    }

    private updatePosition(): void {
        if (!this.position) return;
        const screenSize = { height: 0, width: 0 };
        const windowSize = { height: 0, width: 0 };
        this.uiWindow
            .getMonitor()
            .pipe(
                takeUntil(this.destroy$),
                tap((monitor) => {
                    screenSize.height = monitor.height;
                    screenSize.width = monitor.width;
                }),
                switchMap(() => this.uiWindow.getSize()),
                tap((_windowSize) => {
                    windowSize.height = _windowSize.height;
                    windowSize.width = _windowSize.width;
                }),
                map(() => toTopLeftFn(this.position!, screenSize, windowSize)),
                switchMap((newPos) => this.uiWindow.changePosition(newPos.left, newPos.top)),
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
