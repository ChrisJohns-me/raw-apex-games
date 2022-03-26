import { Injectable, OnDestroy } from "@angular/core";
import { FeatureState, OverwolfFeatureDep } from "@shared-app/feature-status";
import { Subject } from "rxjs";
import { OverwolfFeatureStatusService } from "./overwolf/overwolf-feature-status.service";

@Injectable()
export abstract class BaseService implements OnDestroy {
    protected allFeatureDeps?: OverwolfFeatureDep[];

    protected readonly destroy$ = new Subject<void>();

    constructor(private readonly __overwolfGameDataStatus?: OverwolfFeatureStatusService) {}

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
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