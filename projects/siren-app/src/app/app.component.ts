import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { UIWindow, UIWindowInfo } from "@shared-app/_refactor/ui-window";
import { Observable } from "rxjs";
import { WindowName } from "./modules/core/window-name";

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
