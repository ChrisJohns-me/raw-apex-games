import { BehaviorSubject, Subject } from "rxjs";
import { ExtractSubjectType } from "../../../../../../../../common/types/rxjs-utilities";
import { OverwolfFeatureDep } from "../../../../common/feature-status";
import { MatchKillfeedService } from "../../match/match-killfeed.service";

export class MockMatchKillfeedService implements MockedClass<MatchKillfeedService> {
    public killfeedEvent$: MatchKillfeedService["killfeedEvent$"] = new Subject();
    public killfeedEventHistory$: MatchKillfeedService["killfeedEventHistory$"] = new BehaviorSubject<
        ExtractSubjectType<MatchKillfeedService["killfeedEventHistory$"]>
    >([]);

    public playerLastKnownState(
        ...args: Parameters<MatchKillfeedService["playerLastKnownState"]>
    ): ReturnType<MatchKillfeedService["playerLastKnownState"]> {
        return;
    }

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
