import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { mdiChartAreaspline, mdiFencing, mdiMap, mdiViewDashboard } from "@mdi/js";
import { MainPage } from "../pages/main-page";

@Component({
    selector: "app-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
    @Output() public navPage = new EventEmitter<MainPage>();
    @Input() public currentPage: MainPage = MainPage.Dashboard;

    public MainPage = MainPage;
    public navPages: { title: string; icon?: string; page: MainPage }[] = [
        { title: "Dashboard", icon: mdiViewDashboard, page: MainPage.Dashboard },
        { title: "Match Explorer", icon: mdiFencing, page: MainPage.MatchExplorer },
        { title: "Map Explorer", icon: mdiMap, page: MainPage.MapExplorer },
        { title: "Charts", icon: mdiChartAreaspline, page: MainPage.Charting },
    ];

    public goToPage(page: MainPage): void {
        this.navPage.next(page);
    }
}
