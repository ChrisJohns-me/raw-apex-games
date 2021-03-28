import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { APP_NAME } from "@common/app";

@Component({
    selector: "app-ui-container",
    template: ``,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MockUIContainerComponent {
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

    public ngOnInit(): void {}

    public onCloseButtonClick(): void {}

    public onTitlebarMouseDown(event: Event): void {}

    public onContentMouseDown(event: Event): void {}
}
