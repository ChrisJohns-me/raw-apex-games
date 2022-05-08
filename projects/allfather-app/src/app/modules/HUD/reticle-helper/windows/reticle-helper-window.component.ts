import { OverwolfWindowName } from "@allfather-app/app/common/overwolf-window";
import { DefaultSetting } from "@allfather-app/app/common/settings";
import { ConfigurationService } from "@allfather-app/app/modules/core/configuration.service";
import { OverwolfInputTrackingService } from "@allfather-app/app/modules/core/overwolf/overwolf-input-tracking.service";
import { SettingsService } from "@allfather-app/app/modules/core/settings.service";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { combineLatest, Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import { AimingReticle, AimingReticleList } from "../components/aiming-reticle/aiming-reticles";

@Component({
    selector: "app-hud-reticle-helper-window",
    templateUrl: "./reticle-helper-window.component.html",
    styleUrls: ["./reticle-helper-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReticleHelperWindowComponent implements OnInit, OnDestroy {
    public aimingReticle: AimingReticle = AimingReticleList[0];
    public isAimingReticleEnabled = false;
    public get isAimingReticleHidden(): boolean {
        return this.isAimingReticleDynamicHideSetting && this.isRMBPressed;
    }

    public readonly OverwolfWindowName = OverwolfWindowName;

    private isRMBPressed = false;
    private isAimingReticleDynamicHideSetting = false;

    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly configuration: ConfigurationService,
        private readonly overwolfInputTracking: OverwolfInputTrackingService,
        private readonly settings: SettingsService
    ) {}

    public ngOnInit(): void {
        this.setupSettingsListener();
        this.setupInputListener();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private setupSettingsListener(): void {
        combineLatest([this.configuration.config$, this.settings.streamAllSettings$()])
            .pipe(takeUntil(this.destroy$))
            .subscribe(([config, allSettings]) => {
                const isEnabledDefaultValue = DefaultSetting.enableInGameAimingReticle as boolean;
                const isAimingReticleSettingEnabled = (
                    allSettings.enableInGameAimingReticle != null ? allSettings.enableInGameAimingReticle : isEnabledDefaultValue
                ) as boolean;
                this.isAimingReticleEnabled = isAimingReticleSettingEnabled && config.featureFlags.reticleHelper.aimingReticle;

                const aimingReticle = {
                    ...AimingReticleList.find((reticle) => reticle.reticleId === allSettings.inGameAimingReticleId),
                } as AimingReticle;
                if (!aimingReticle) return;
                aimingReticle.hexColor = allSettings.inGameAimingReticleColor as string;
                aimingReticle.alpha = allSettings.inGameAimingReticleAlpha as number;

                const dynamicHideDefaultValue = DefaultSetting.inGameAimingReticleDynamicHide as boolean;
                this.isAimingReticleDynamicHideSetting = (
                    allSettings.inGameAimingReticleDynamicHide != null
                        ? allSettings.inGameAimingReticleDynamicHide
                        : dynamicHideDefaultValue
                ) as boolean;

                this.aimingReticle = aimingReticle;
                this.cdr.detectChanges();
            });
    }

    private setupInputListener(): void {
        this.overwolfInputTracking.mouseDown$
            .pipe(
                takeUntil(this.destroy$),
                filter((mouseDownEvent) => !!mouseDownEvent.onGame && mouseDownEvent.button === "right")
            )
            .subscribe(() => {
                this.isRMBPressed = true;
                this.cdr.detectChanges();
            });

        this.overwolfInputTracking.mouseUp$
            .pipe(
                takeUntil(this.destroy$),
                filter((mouseUpEvent) => !!mouseUpEvent.onGame && mouseUpEvent.button === "right")
            )
            .subscribe(() => {
                this.isRMBPressed = false;
                this.cdr.detectChanges();
            });
    }
}
