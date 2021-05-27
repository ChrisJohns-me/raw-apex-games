import { OverwolfFeatureDep } from "@allfather-app/app/common/feature-status";
import { MatchMapService } from "@allfather-app/app/modules/core/match/match-map.service";
import { BehaviorSubject } from "rxjs";
import { ExtractSubjectType } from "shared/types/rxjs-utilities";

export class MockMatchMapService implements MockedClass<MatchMapService> {
    public map$: MatchMapService["map$"] = new BehaviorSubject<ExtractSubjectType<MatchMapService["map$"]>>(undefined);

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
