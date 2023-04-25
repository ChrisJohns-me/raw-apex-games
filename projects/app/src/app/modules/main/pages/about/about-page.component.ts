import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MainDesktopWindowService } from "../../windows/main-desktop-window.service.js";
import { MainInGameWindowService } from "../../windows/main-ingame-window.service.js";
import { MainPage } from "../main-page.js";

@Component({
    selector: "app-about-page",
    styleUrls: ["./about-page.component.scss"],
    templateUrl: "./about-page.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPageComponent {
    constructor(private readonly mainDesktopWindow: MainDesktopWindowService, private readonly mainInGameWindow: MainInGameWindowService) {}

    public onHomeClick(): void {
        this.mainDesktopWindow.goToPage(MainPage.RawApexGames);
        this.mainInGameWindow.goToPage(MainPage.RawApexGames);
    }
}
