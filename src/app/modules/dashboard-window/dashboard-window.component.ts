import { Component } from "@angular/core";
import { InGameTestWindowService } from "../in-game-test-window/in-game-test-window.service";

@Component({
    selector: "app-dashboard-window",
    templateUrl: "./dashboard-window.component.html",
    styleUrls: ["./dashboard-window.component.scss"],
})
export class DashboardWindowComponent {
    constructor(private inGameTestWindowService: InGameTestWindowService) {}

    public openInGame(): void {
        console.debug("opening in game test window");
        this.inGameTestWindowService.open().subscribe();
    }
}
