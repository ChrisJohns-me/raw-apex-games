import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
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
    public navPages = [
        { title: "Dashboard", page: MainPage.Dashboard },
        { title: "Map Explorer", page: MainPage.MapExplorer },
        { title: "Charts", page: MainPage.Charting },
    ];

    public goToPage(page: MainPage): void {
        this.navPage.next(page);
    }
}
