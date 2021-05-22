import { BehaviorSubject } from "rxjs";
import { OverwolfFeatureState } from "../../overwolf/dto/overwolf-feature-status-dto";
import { FeatureStatusList, OverwolfFeatureDep, OverwolfFeatureStatusService } from "../../overwolf/overwolf-feature-status.service";

export class MockOverwolfFeatureStatusService implements MockedClass<OverwolfFeatureStatusService> {
    public featureStatusList$: BehaviorSubject<FeatureStatusList> = new BehaviorSubject<FeatureStatusList>({});

    public checkFeatureStatus(featureName: OverwolfFeatureDep): OverwolfFeatureState {
        return OverwolfFeatureState.Unavailable;
    }

    public checkAllFeatureStatus(): OverwolfFeatureState {
        return OverwolfFeatureState.Unavailable;
    }
}
