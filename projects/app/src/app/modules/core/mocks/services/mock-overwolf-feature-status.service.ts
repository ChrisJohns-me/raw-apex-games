import { FeatureState, FeatureStates, OverwolfFeatureDep } from "@app/app/common/feature-status";
import { OverwolfFeatureStatusService } from "@app/app/modules/core/overwolf/overwolf-feature-status.service";
import { BehaviorSubject, Observable, of } from "rxjs";

export class MockOverwolfFeatureStatusService implements MockedClass<OverwolfFeatureStatusService> {
    public featureStates$: BehaviorSubject<FeatureStates> = new BehaviorSubject<FeatureStates>({});

    public checkFeatureState(featureName: OverwolfFeatureDep): FeatureState {
        return FeatureState.Unavailable;
    }

    public checkAllFeatureStates(): FeatureState {
        return FeatureState.Unavailable;
    }

    public getFeatureStates$(): Observable<FeatureStates> {
        return of({});
    }
}
