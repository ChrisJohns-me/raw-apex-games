import { FeatureState, OverwolfFeatureDep } from "@allfather-app/app/common/feature-status";
import { Injectable, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { OverwolfFeatureStatusService } from "./overwolf/overwolf-feature-status.service";

@Injectable()
export abstract class AllfatherService implements OnDestroy {
    protected allFeatureDeps?: OverwolfFeatureDep[];

    protected readonly isDestroyed$ = new Subject<void>();

    constructor(private readonly __overwolfGameDataStatus?: OverwolfFeatureStatusService) {}

    public ngOnDestroy(): void {
        this.isDestroyed$.next();
        this.isDestroyed$.complete();
    }

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        if (!this.__overwolfGameDataStatus) throw Error(`Cannot check for feature availability; Game Data Status service not provided.`);
        const featureStatusList = this.__overwolfGameDataStatus.featureStatusList$.value;
        return featureName in featureStatusList && featureStatusList[featureName] === FeatureState.Good;
    }

    public areAllFeatureDepsAvailable(): boolean {
        if (!this.__overwolfGameDataStatus) throw Error(`Cannot check for feature availability; Game Data Status service not provided.`);
        if (!this.allFeatureDeps) throw Error(`Cannot check for feature availability; Dependencies not provided.`);
        if (this.allFeatureDeps.length === 0) return true;
        const featureStatusList = this.__overwolfGameDataStatus.featureStatusList$.value;
        return this.allFeatureDeps.every((f) => f in featureStatusList && featureStatusList[f] === FeatureState.Good);
    }
}
