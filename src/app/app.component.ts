import { ChangeDetectionStrategy, Component, NgZone } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { OWWindows, WindowInfo } from "./core/overwolf";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    public windowInfo!: Observable<WindowInfo["name"]>;

    constructor(
        private readonly ngZone: NgZone,
        private readonly title: Title
    ) {}

    public ngOnInit(): void {
        this.windowInfo = OWWindows.getCurrentWindow().pipe(
            tap((win) => {
                console.log("Current window:", win);
            }),
            map((win) => win.name)
        );
    }
}
