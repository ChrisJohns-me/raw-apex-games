import { OverwolfFeatureDep } from "@app/app/common/feature-status";
import { ExtractSubjectType } from "common/types/rxjs-utilities";
import { BehaviorSubject } from "rxjs";
import { MatchMapService } from "../../match/match-map.service";

export class MockMatchMapService implements MockedClass<MatchMapService> {
    public map$: MatchMapService["map$"] = new BehaviorSubject<ExtractSubjectType<MatchMapService["map$"]>>(undefined);

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
