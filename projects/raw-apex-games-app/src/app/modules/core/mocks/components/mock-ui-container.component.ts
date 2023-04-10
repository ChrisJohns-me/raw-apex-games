import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { mdiCogOutline, mdiWindowClose, mdiWindowMaximize, mdiWindowMinimize, mdiWindowRestore } from "@mdi/js";
import { APP_NAME } from "@raw-apex-games-app/app/common/app";
import { OverwolfWindowName, OverwolfWindowState } from "@raw-apex-games-app/app/common/overwolf-window";
import {
    ConfigPositionXAnchor,
    ConfigPositionYAnchor,
    UIContainerComponent,
} from "@raw-apex-games-app/app/shared/components/ui-container/ui-container.component";

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
    template: ``,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MockUIContainerComponent implements MockedClass<UIContainerComponent> {
    @Input() public set overwolfWindowName(value: OverwolfWindowName) {}
    @Input() public injectBootstrapCSS = false;
    @Input() public resolutionZoom = true;
    @Input() public isContentDraggable = true;
    @Input() public isDesktopWindow = true;
    @Input() public isTitlebarDraggable = true;
    @Input() public isMaximizable = true;
    @Input() public isMinimizable = true;
    @Input() public position?: WindowPositionInput;
    @Input() public size?: WindowSizeInput;
    @Input() public set primaryTitle(value: string) {
        this.titleService.setTitle(value ? `${value} - ${APP_NAME}` : APP_NAME);
        this._primaryTitle = value;
    }
    public get primaryTitle(): string {
        return this._primaryTitle ? `${APP_NAME} - ${this._primaryTitle}` : APP_NAME;
    }
    @Input() public secondaryTitle = "";
    @Input() public enablePageviewTracking = true;
    @Input() public showSettingsLink = false;
    @Input("onCloseButtonClick") public onCloseFn?: () => void;

    public state: OverwolfWindowState = OverwolfWindowState.Normal;
    public isDev = false;
    public WindowState = OverwolfWindowState;
    public mdiCogOutline = mdiCogOutline;
    public mdiWindowMinimize = mdiWindowMinimize;
    public mdiWindowMaximize = mdiWindowMaximize;
    public mdiWindowRestore = mdiWindowRestore;
    public mdiWindowClose = mdiWindowClose;
    private _primaryTitle = "";

    constructor(private readonly titleService: Title) {}

    public onSettingsButtonClick(): void {}

    public onMinimizeButtonClick(): void {}

    public onMaximizeButtonClick(): void {}

    public onCloseButtonClick(): void {}

    public onTitlebarMouseDown(event: Event): void {}

    public onTitlebarDoubleClick(event: Event): void {}

    public onContentMouseDown(event: Event): void {}
}
