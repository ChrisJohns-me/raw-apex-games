import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { OverwolfWindow, OverwolfWindowName } from "./models/overwolf-window.js";
import { OWWindowInfo } from "./modules/core/overwolf/types/overwolf-types.js";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
    public OverwolfWindowName = OverwolfWindowName;
    public owWindowInfo?: Observable<OWWindowInfo>;

    public ngOnInit(): void {
        this.owWindowInfo = OverwolfWindow.getCurrentWindow();
    }
}
