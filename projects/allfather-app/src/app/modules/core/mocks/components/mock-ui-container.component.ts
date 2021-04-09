import { UIContainerComponent } from "@allfather-app/app/shared/components/ui-container/ui-container.component";
import { APP_NAME } from "@allfather-app/app/shared/models/app";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Title } from "@angular/platform-browser";

@Component({
    selector: "app-ui-container",
    template: ``,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MockUIContainerComponent implements MockedClass<UIContainerComponent> {
    @Input() public injectBootstrapCSS = false;
    @Input() public isDesktopWindow = true;
    @Input() public isTitlebarDraggable = true;
    @Input() public isContentDraggable = true;
    @Input() public set primaryTitle(value: string) {
        this.titleService.setTitle(`${APP_NAME} - ${value}`);
        this._primaryTitle = value;
    }
    public get primaryTitle(): string {
        return this._primaryTitle;
    }
    @Input() public secondaryTitle = "";

    private _primaryTitle = "";

    constructor(private readonly titleService: Title) {}

    public onCloseButtonClick(): void {}

    public onTitlebarMouseDown(event: Event): void {}

    public onContentMouseDown(event: Event): void {}
}