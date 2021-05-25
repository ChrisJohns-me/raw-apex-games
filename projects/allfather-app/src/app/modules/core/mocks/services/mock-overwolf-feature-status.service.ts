import { FeatureState, FeatureStatusList, OverwolfFeatureDep } from "@allfather-app/app/common/feature-status";
import { BehaviorSubject, Observable, of } from "rxjs";
import { OverwolfFeatureStatusService } from "../../overwolf/overwolf-feature-status.service";

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
