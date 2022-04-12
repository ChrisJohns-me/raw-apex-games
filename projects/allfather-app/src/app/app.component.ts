import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { UIWindow, UIWindowInfo } from "./common/ui-window";
import { WindowName } from "./common/window-name";

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
