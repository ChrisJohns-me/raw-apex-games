import { UIWindow } from "@allfather-app/app/modules/core/_refactor/ui-window";
import { APP_NAME } from "@allfather-app/app/shared/models/app";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Observable } from "rxjs";
import { map, shareReplay, switchMap } from "rxjs/operators";

@Component({
    selector: "app-ui-container",
    templateUrl: "./ui-container.component.html",
    styleUrls: ["./ui-container.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UIContainerComponent {
    @Input() public isDesktopWindow = true;
    @Input() public isTitlebarDraggable = true;
    @Input() public isContentDraggable = true;
    @Input() public injectBootstrapCSS = false;
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

    constructor(private readonly titleService: Title) {}

    public ngOnInit(): void {
        this.obtained$ = this.uiWindow.assureObtained().pipe(
            map(() => true),
            shareReplay(1)
        );
    }

    public onCloseButtonClick(): void {
        this.obtained$?.pipe(switchMap(() => this.uiWindow.close())).subscribe();
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
        this.obtained$?.subscribe(() => this.uiWindow.dragMove());
    }
}
