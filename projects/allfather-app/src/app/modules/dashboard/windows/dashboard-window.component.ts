import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";

@Component({
    selector: "app-dashboard-window",
    templateUrl: "./dashboard-window.component.html",
    styleUrls: ["./dashboard-window.component.scss"],
})
export class DashboardWindowComponent implements OnInit, OnDestroy {
    private _unsubscribe$ = new Subject<void>();

    constructor() {}

    public ngOnInit(): void {}

    public ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }
}
