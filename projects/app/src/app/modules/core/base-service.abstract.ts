import { FeatureState, OverwolfFeatureDep } from "#app/models/feature-status.js";
import { Injectable, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { OverwolfFeatureStatusService } from "./overwolf/overwolf-feature-status.service.js";

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
        const featureStates = this.__overwolfGameDataStatus.featureStates$.value;
        return featureName in featureStates && featureStates[featureName] === FeatureState.Good;
    }

    public areAllFeatureDepsAvailable(): boolean {
        if (!this.__overwolfGameDataStatus) throw Error(`Cannot check for feature availability; Game Data Status service not provided.`);
        if (!this.allFeatureDeps) throw Error(`Cannot check for feature availability; Dependencies not provided.`);
        if (this.allFeatureDeps.length === 0) return true;
        const featureStates = this.__overwolfGameDataStatus.featureStates$.value;
        return this.allFeatureDeps.every((f) => f in featureStates && featureStates[f] === FeatureState.Good);
    }
}
