import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-ui-container",
    templateUrl: "./ui-container.component.html",
    styleUrls: ["./ui-container.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UIContainerComponent {
    @Input() public showTitlebar = true;
    @Input() public isTitlebarDraggable = true;
    @Input() public isContentDraggable = true;
    @Input() public primaryTitle = "";
    @Input() public secondaryTitle = "";
}
