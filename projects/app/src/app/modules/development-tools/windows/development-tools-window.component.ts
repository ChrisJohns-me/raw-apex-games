import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { OverwolfWindowName } from "../../../common/overwolf-window";
import { OWGameEvent, OWInfoUpdates2Event } from "../../../modules/core/overwolf";
import { ExposedOverwolfGameDataService } from "../../../modules/core/overwolf-exposed-data.service";
import { OverwolfExtensionsService } from "../../../modules/core/overwolf/overwolf-extensions.service";

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

    public readonly OverwolfWindowName = OverwolfWindowName;

    private destroy$ = new Subject<void>();

    constructor(
        private readonly exposedOverwolfGameData: ExposedOverwolfGameDataService,
        private readonly overwolfExtensions: OverwolfExtensionsService
    ) {
        this.infoUpdates$ = this.exposedOverwolfGameData.rawInfoUpdates$;
        this.newGameEvent$ = this.exposedOverwolfGameData.rawNewGameEvent$;
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
