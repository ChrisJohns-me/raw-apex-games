import { OWGameEvent, OWInfoUpdates2Event } from "@allfather-app/app/common/services/overwolf";
import { ExposedOverwolfGameDataService } from "@allfather-app/app/common/services/overwolf-exposed-data.service";
import { OverwolfExtensionsService } from "@allfather-app/app/common/services/overwolf/overwolf-extensions.service";
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";

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

    private destroy$ = new Subject<void>();

    constructor(
        private readonly exposedOverwolfData: ExposedOverwolfGameDataService,
        private readonly overwolfExtensions: OverwolfExtensionsService
    ) {
        this.infoUpdates$ = this.exposedOverwolfData.rawInfoUpdates$;
        this.newGameEvent$ = this.exposedOverwolfData.rawNewGameEvent$;
    }

    public ngOnInit(): void {}

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public relaunchApp(): void {
        this.overwolfExtensions.relaunchApp();
    }
}
