import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { mdiCogOutline, mdiViewDashboard } from "@mdi/js";
import { MainPage } from "../pages/main-page";

interface NavPage {
    title: string;
    icon: string;
    page: MainPage;
}

@Component({
    selector: "app-sidebar",
    templateUrl: "./sidebar.component.html",
    styleUrls: ["./sidebar.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
    @Output() public navPage = new EventEmitter<MainPage>();
    @Output() public subPage = new EventEmitter<MainPage>();
    @Input() public currentPage: MainPage = MainPage.Dashboard;

    public MainPage = MainPage;
    public navPages: NavPage[] = [
        { title: "Dashboard", icon: mdiViewDashboard, page: MainPage.Dashboard },
        { title: "Latest Reports", icon: mdiViewDashboard, page: MainPage.LatestReports },
        { title: "My Reports", icon: mdiViewDashboard, page: MainPage.MyReports },
    ];
    public subPages: NavPage[] = [{ title: "Settings", icon: mdiCogOutline, page: MainPage.Settings }];

    public goToPage(page: MainPage): void {
        this.navPage.next(page);
    }
}
