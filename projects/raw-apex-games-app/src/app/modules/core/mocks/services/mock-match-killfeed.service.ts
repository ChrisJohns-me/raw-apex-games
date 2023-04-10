import { OverwolfFeatureDep } from "@raw-apex-games-app/app/common/feature-status";
import { MatchKillfeedService } from "@raw-apex-games-app/app/modules/core/match/match-killfeed.service";
import { ExtractSubjectType } from "common/types/rxjs-utilities";
import { BehaviorSubject, Subject } from "rxjs";

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
