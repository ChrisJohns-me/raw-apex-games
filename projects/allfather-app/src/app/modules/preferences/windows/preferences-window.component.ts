import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
    selector: "app-preferences-window",
    templateUrl: "./preferences-window.component.html",
    styleUrls: ["./preferences-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreferencesWindowComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
