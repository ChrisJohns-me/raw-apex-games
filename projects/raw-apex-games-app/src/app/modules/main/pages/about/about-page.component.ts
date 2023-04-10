import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "app-about-page",
    styleUrls: ["./about-page.component.scss"],
    templateUrl: "./about-page.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPageComponent {}
