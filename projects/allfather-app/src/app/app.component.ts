import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { UIWindow, UIWindowInfo, WindowName } from "./modules/core/_refactor/ui-window";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
    public WindowName = WindowName;
    public uiWindowInfo?: Observable<UIWindowInfo>;

    public ngOnInit(): void {
        this.uiWindowInfo = UIWindow.getCurrentWindow();
    }
}
