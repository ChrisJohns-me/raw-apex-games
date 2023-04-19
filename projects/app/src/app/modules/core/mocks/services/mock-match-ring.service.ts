import { BehaviorSubject } from "rxjs";
import { ExtractSubjectType } from "../../../../../../../../common/types/rxjs-utilities";
import { OverwolfFeatureDep } from "../../../../common/feature-status";
import { MatchRingService } from "../../match/match-ring.service";

export class MockMatchRingService implements MockedClass<MatchRingService> {
    public currentBRRing$: MatchRingService["currentBRRing$"] = new BehaviorSubject<ExtractSubjectType<MatchRingService["currentBRRing$"]>>(
        undefined
    );
    public allBRRings$: MatchRingService["allBRRings$"] = new BehaviorSubject<ExtractSubjectType<MatchRingService["allBRRings$"]>>([]);

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
