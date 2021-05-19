import { OWGameEvent, OWInfoUpdates2Event } from "@allfather-app/app/modules/core/overwolf";
import { ExposedOverwolfGameDataService } from "@allfather-app/app/modules/core/overwolf-exposed-data.service";
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { OverwolfExtensionsService } from "../../core/overwolf/overwolf-extensions.service";

type MainTab = "simulate" | "logs";

@Component({
    selector: "app-development-tools-window",
    templateUrl: "./development-tools-window.component.html",
    styleUrls: ["./development-tools-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevelopmentToolsWindowComponent implements OnInit, OnDestroy {
    public selectedMainTab: MainTab = "simulate";
    public mainTabOptions: MainTab[] = ["simulate", "logs"];

    public infoUpdates$: Subject<OWInfoUpdates2Event>;
    public newGameEvent$: Subject<OWGameEvent>;

    private isDestroyed$ = new Subject<void>();

    constructor(
        private readonly exposedOverwolfData: ExposedOverwolfGameDataService,
        private readonly overwolfExtensions: OverwolfExtensionsService
    ) {
        this.infoUpdates$ = this.exposedOverwolfData.rawInfoUpdates$;
        this.newGameEvent$ = this.exposedOverwolfData.rawNewGameEvent$;
    }

    public ngOnInit(): void {}

    public ngOnDestroy(): void {
        this.isDestroyed$.next();
        this.isDestroyed$.complete();
    }

    public relaunchApp(): void {
        this.overwolfExtensions.relaunchApp();
    }
}
