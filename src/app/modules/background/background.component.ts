import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { APP_NAME } from "@common/app";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DashboardWindowService } from "../dashboard-window/dashboard-window.service";
import { BackgroundService } from "./background.service";

@Component({
    selector: "app-background",
    template: "",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgroundComponent implements OnInit, OnDestroy {
    private readonly _unsubscribe = new Subject<void>();

    constructor(
        private readonly backgroundService: BackgroundService,
        private readonly dashboardWindow: DashboardWindowService,
        private readonly titleService: Title
    ) {}

    public ngOnInit(): void {
        this.titleService.setTitle(`${APP_NAME} - Background`);
        this.backgroundService.startBackgroundServices();
        this.registerUIWindows();
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private registerUIWindows(): void {
        this.dashboardWindow.open().pipe(takeUntil(this._unsubscribe)).subscribe();
    }
}
