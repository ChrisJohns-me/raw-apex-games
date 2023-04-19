import { BehaviorSubject, Observable, of } from "rxjs";
import { FeatureState, FeatureStates, OverwolfFeatureDep } from "../../../../common/feature-status";
import { OverwolfFeatureStatusService } from "../../overwolf/overwolf-feature-status.service";

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
