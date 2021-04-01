import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { APP_NAME } from "@shared/models/app";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DevelopmentToolsWindowService } from "../development-tools/windows/development-tools-window.service";
import { BackgroundService } from "./background.service";

@Component({
    selector: "app-background",
    template: "",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgroundComponent implements OnInit, OnDestroy {
    private readonly _unsubscribe$ = new Subject<void>();

    constructor(
        private readonly backgroundService: BackgroundService,
        private readonly developmentToolsWindow: DevelopmentToolsWindowService,
        private readonly titleService: Title
    ) {}

    public ngOnInit(): void {
        this.titleService.setTitle(`${APP_NAME} - Background`);
        this.backgroundService.startBackgroundServices();
        this.registerUIWindows();
    }

    public ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    private registerUIWindows(): void {
        this.developmentToolsWindow.open().pipe(takeUntil(this._unsubscribe$)).subscribe();
    }
}
