import { APP_NAME } from "@allfather-app/app/common/app";
import { WindowState } from "@allfather-app/app/modules/core/_refactor/ui-window";
import { UIContainerComponent } from "@allfather-app/app/shared/components/ui-container/ui-container.component";
import { ConfigPositionUnit, ConfigPositionXAnchor, ConfigPositionYAnchor } from "@allfather-app/configs/config.interface";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { mdiWindowClose, mdiWindowMaximize, mdiWindowMinimize, mdiWindowRestore } from "@mdi/js";

@Component({
    selector: "app-ui-container",
    template: ``,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MockUIContainerComponent implements MockedClass<UIContainerComponent> {
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
    public state: WindowState = WindowState.Normal;

    public WindowState = WindowState;
    public mdiWindowMinimize = mdiWindowMinimize;
    public mdiWindowMaximize = mdiWindowMaximize;
    public mdiWindowRestore = mdiWindowRestore;
    public mdiWindowClose = mdiWindowClose;

    private _primaryTitle = "";

    constructor(private readonly titleService: Title) {}

    public onMinimizeButtonClick(): void {}

    public onMaximizeButtonClick(): void {}

    public onCloseButtonClick(): void {}

    public onTitlebarMouseDown(event: Event): void {}

    public onTitlebarDoubleClick(event: Event): void {}

    public onContentMouseDown(event: Event): void {}
}
