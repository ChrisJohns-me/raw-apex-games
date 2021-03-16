import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { UIWindow, UIWindowInfo } from "@core/_refactor/ui-window";
import { Observable } from "rxjs";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
    public uiWindowInfo?: Observable<UIWindowInfo>;

    public ngOnInit(): void {
        this.uiWindowInfo = UIWindow.getCurrentWindow();
    }
}
