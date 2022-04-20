import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "app-welcome-content",
    styleUrls: ["./welcome-content.component.scss"],
    templateUrl: "./welcome-content.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeContentComponent {}
