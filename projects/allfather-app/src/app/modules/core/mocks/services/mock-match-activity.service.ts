import { MatchActivityService } from "@allfather-app/app/modules/core/match/match-activity.service";
import { BehaviorSubject, Subject } from "rxjs";
import { ExtractSubjectType } from "shared/types/rxjs-utilities";

export class MockMatchActivityService implements MockedClass<MatchActivityService> {
    public killfeedEvent$: MatchActivityService["killfeedEvent$"] = new Subject();
    public killfeedEventHistory$: MatchActivityService["killfeedEventHistory$"] = new BehaviorSubject<
        ExtractSubjectType<MatchActivityService["killfeedEventHistory$"]>
    >([]);

    public init(): void {
        throw new Error("Method not implemented.");
    }
    public playerLastKnownState(
        ...args: Parameters<MatchActivityService["playerLastKnownState"]>
    ): ReturnType<MatchActivityService["playerLastKnownState"]> {
        throw new Error("Method not implemented.");
    }
}
