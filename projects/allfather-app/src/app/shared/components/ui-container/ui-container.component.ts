import { UIWindow } from "@allfather-app/app/modules/core/_refactor/ui-window";
import { APP_NAME } from "@allfather-app/app/shared/models/app";
import { ConfigPositionUnit, ConfigPositionXAnchor, ConfigPositionYAnchor } from "@allfather-app/configs/config.interface";
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Observable, Subject } from "rxjs";
import { map, shareReplay, switchMap, takeUntil } from "rxjs/operators";

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
    @Input() public position: { top: number; left: number } = { top: 0, left: 0 };
    @Input() public positionUnit: ConfigPositionUnit = "pixel";
    @Input() public positionXAnchor: ConfigPositionXAnchor = "left";
    @Input() public positionYAnchor: ConfigPositionYAnchor = "top";
    @Input() public set primaryTitle(value: string) {
        this.titleService.setTitle(`${APP_NAME} - ${value}`);
        this._primaryTitle = value;
    }
    public get primaryTitle(): string {
        return this._primaryTitle;
    }
    @Input() public secondaryTitle = "";

    private readonly uiWindow = new UIWindow();
    private _primaryTitle = "";
    private obtained$?: Observable<boolean>;
    private _unsubscribe$ = new Subject<void>();
    constructor(private readonly titleService: Title) {}

    public ngOnInit(): void {
        this.obtained$ = this.uiWindow.assureObtained().pipe(
            map(() => true),
            shareReplay(1)
        );
    }

    public ngAfterViewInit(): void {
        this.updatePosition();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.position || changes.positionUnit || changes.positionXAnchor || changes.positionYAnchor) {
            this.updatePosition();
        }
    }

    public ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    public onCloseButtonClick(): void {
        this.obtained$
            ?.pipe(
                takeUntil(this._unsubscribe$),
                switchMap(() => this.uiWindow.close())
            )
            .subscribe();
    }

    public onTitlebarMouseDown(event: Event): void {
        if (!this.isTitlebarDraggable) return;
        if (!(event instanceof MouseEvent)) return;
        this.onDrag(event);
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
        this.obtained$?.pipe(takeUntil(this._unsubscribe$)).subscribe(() => this.uiWindow.dragMove());
    }

    private updatePosition(): void {
        // position.top
        // position.left
        // positionUnit = "pixel"
        // positionXAnchor
        // positionYAnchor
        // const percentFn = (x: number, y: number) => {};
        // const pixelFn = (x: number, y: number) => {};
        // const logicalPixelFn = (x: number, y: number) => {};
        // const normalizeFn = (toUnit: "pixel" | "percent", pos: { x: number; y: number }): { x: number; y: number } => {
        //     if (this.positionUnit === "percent") {
        //         return;
        //     } else {
        //         return pos;
        //     }
        // };
        // this.uiWindow
        //     .getMonitor()
        //     .pipe(
        //         takeUntil(this._unsubscribe$),
        //         switchMap((monitor) => {
        //             combineLatest([, this.uiWindow.getSize()]);
        //         })
        //     )
        //     .pipe(
        //         takeUntil(this._unsubscribe$),
        //         map((size) => {}),
        //         switchMap((newPos) => this.uiWindow.changePosition(newPos.left, newPos.top))
        //     )
        //     .subscribe();
    }
}
