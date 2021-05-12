import { UIWindow } from "@allfather-app/app/modules/core/_refactor/ui-window";
import { APP_NAME } from "@allfather-app/app/shared/models/app";
import { ConfigPositionUnit, ConfigPositionXAnchor, ConfigPositionYAnchor } from "@allfather-app/configs/config.interface";
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Observable, Subject } from "rxjs";
import { map, shareReplay, switchMap, takeUntil, tap } from "rxjs/operators";

@Component({
    selector: "app-ui-container",
    templateUrl: "./ui-container.component.html",
    styleUrls: ["./ui-container.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UIContainerComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
    @Input() public injectBootstrapCSS = false;
    @Input() public isContentDraggable = true;
    @Input() public isDesktopWindow = true;
    @Input() public isTitlebarDraggable = true;
    @Input() public isMaximizable = true;
    @Input() public isMinimizable = true;
    @Input() public position = { y: 0, x: 0 };
    @Input() public positionUnits: { x: ConfigPositionUnit; y: ConfigPositionUnit } = { x: "pixel", y: "pixel" };
    @Input() public positionAnchors: { x: ConfigPositionXAnchor; y: ConfigPositionYAnchor } = { x: "left", y: "top" };
    @Input() public set primaryTitle(value: string) {
        this.titleService.setTitle(value ? `${value} - ${APP_NAME}` : APP_NAME);
        this._primaryTitle = value;
    }
    public get primaryTitle(): string {
        return this._primaryTitle ? `${APP_NAME} - ${this._primaryTitle}` : APP_NAME;
    }
    @Input() public secondaryTitle = "";

    private readonly uiWindow = new UIWindow();
    private _primaryTitle = "";
    private obtained$?: Observable<boolean>;
    private isDestroyed$ = new Subject<void>();

    constructor(private readonly titleService: Title) {
        this.titleService.setTitle(APP_NAME);
    }

    public ngOnInit(): void {
        this.obtained$ = this.uiWindow.assureObtained().pipe(
            map(() => true),
            shareReplay(1)
        );
    }

    public ngAfterViewInit(): void {
        // this.updatePosition();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.position || changes.positionUnit || changes.positionXAnchor || changes.positionYAnchor) {
            this.updatePosition();
        }
    }

    public ngOnDestroy(): void {
        this.isDestroyed$.next();
        this.isDestroyed$.complete();
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

    private onDrag(event: MouseEvent): void {
        const target = event.target as HTMLInputElement;
        if (target?.tagName === "INPUT") {
            return;
        }
        event.preventDefault();
        this.obtained$?.pipe(takeUntil(this.isDestroyed$)).subscribe(() => this.uiWindow.dragMove());
    }

    private minimizeToggle(): void {
        this.uiWindow.toggleMinimize().pipe(takeUntil(this.isDestroyed$)).subscribe();
    }

    private maximizeToggle(): void {
        this.uiWindow.toggleMaximize().pipe(takeUntil(this.isDestroyed$)).subscribe();
    }

    private close(): void {
        this.obtained$
            ?.pipe(
                takeUntil(this.isDestroyed$),
                switchMap(() => this.uiWindow.close())
            )
            .subscribe();
    }

    private updatePosition(): void {
        const screenSize = { height: 0, width: 0 };
        const windowSize = { height: 0, width: 0 };
        this.uiWindow
            .getMonitor()
            .pipe(
                takeUntil(this.isDestroyed$),
                tap((monitor) => {
                    screenSize.height = monitor.height;
                    screenSize.width = monitor.width;
                }),
                switchMap(() => this.uiWindow.getSize()),
                tap((_windowSize) => {
                    windowSize.height = _windowSize.height;
                    windowSize.width = _windowSize.width;
                }),
                map(() => xyPosToPixelsFn(this.position, screenSize, this.positionUnits.x, this.positionUnits.y)),
                map((xyPos) => xyPosToTopLeftFn(xyPos, screenSize, windowSize, this.positionAnchors.x, this.positionAnchors.y)),
                switchMap((newPos) => this.uiWindow.changePosition(newPos.left, newPos.top))
            )
            .subscribe();
    }
}

function xyPosToPixelsFn(
    xyPos: { x: number; y: number },
    screenSize: { width: number; height: number },
    fromUnitX: ConfigPositionUnit,
    fromUnitY: ConfigPositionUnit
): { x: number; y: number } {
    const pixelPosition = { ...xyPos };
    if (fromUnitX === "percent") pixelPosition.x = xyPos.x * screenSize.height;
    if (fromUnitY === "percent") pixelPosition.y = xyPos.y * screenSize.width;
    return pixelPosition;
}

function xyPosToTopLeftFn(
    xyPos: { x: number; y: number },
    screenSize: { width: number; height: number },
    windowSize: { width: number; height: number },
    posXAnchor: ConfigPositionXAnchor,
    posYAnchor: ConfigPositionYAnchor
): { left: number; top: number } {
    const topLeftPos = { left: xyPos.x, top: xyPos.y };
    const windowCenterX = windowSize.width / 2;
    const windowCenterY = windowSize.height / 2;
    const screenCenterX = screenSize.width / 2;
    const screenCenterY = screenSize.height / 2;
    if (posXAnchor === "right") topLeftPos.left = screenSize.width - windowSize.width + topLeftPos.left;
    else if (posXAnchor === "center") topLeftPos.left = screenCenterX - windowCenterX + topLeftPos.left;
    if (posYAnchor === "bottom") topLeftPos.top = screenSize.height - windowSize.height + topLeftPos.top;
    else if (posYAnchor === "middle") topLeftPos.top = screenCenterY - windowCenterY + topLeftPos.top;
    return topLeftPos;
}

//     |--.--| = 4 ; centerX = 2
//  |-----.-----| = 10 ; centerX = 5
