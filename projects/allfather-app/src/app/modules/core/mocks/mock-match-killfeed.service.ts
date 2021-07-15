import { MatchKillfeedService } from "@allfather-app/app/modules/core/match/match-killfeed.service";
import { OverwolfFeatureDep } from "@shared-app/feature-status";
import { ExtractSubjectType } from "common/types/rxjs-utilities";
import { BehaviorSubject, Subject } from "rxjs";

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
