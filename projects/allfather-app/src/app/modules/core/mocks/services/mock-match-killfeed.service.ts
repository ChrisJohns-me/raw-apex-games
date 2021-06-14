import { OverwolfFeatureDep } from "@allfather-app/app/common/feature-status";
import { MatchKillfeedService } from "@allfather-app/app/modules/core/match/match-killfeed.service";
import { BehaviorSubject, Subject } from "rxjs";
import { ExtractSubjectType } from "shared/types/rxjs-utilities";

export class MockmatchKillfeedService implements MockedClass<MatchKillfeedService> {
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
