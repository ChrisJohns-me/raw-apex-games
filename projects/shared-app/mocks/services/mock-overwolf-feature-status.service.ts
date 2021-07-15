import { FeatureState, FeatureStatusList, OverwolfFeatureDep } from "@shared-app/feature-status";
import { OverwolfFeatureStatusService } from "@shared-app/services/overwolf/overwolf-feature-status.service";
import { BehaviorSubject, Observable, of } from "rxjs";

export class MockOverwolfFeatureStatusService implements MockedClass<OverwolfFeatureStatusService> {
    public featureStatusList$: BehaviorSubject<FeatureStatusList> = new BehaviorSubject<FeatureStatusList>({});

    public checkFeatureStatus(featureName: OverwolfFeatureDep): FeatureState {
        return FeatureState.Unavailable;
    }

    public checkAllFeatureStatus(): FeatureState {
        return FeatureState.Unavailable;
    }

    public getFeatureStatusList$(): Observable<FeatureStatusList> {
        return of({});
    }
}
