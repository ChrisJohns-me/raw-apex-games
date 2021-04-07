import { MatchActivityService } from "@core/match/match-activity.service";
import { BehaviorSubject, Subject } from "rxjs";

export class MockMatchActivityService implements MockedClass<MatchActivityService> {
    public killfeedEvent$: MatchActivityService["killfeedEvent$"] = new Subject();
    public killfeedEventHistory$: MatchActivityService["killfeedEventHistory$"] = new BehaviorSubject<
        MatchActivityService["killfeedEventHistory$"]["value"]
    >([]);

    public start(): void {
        throw new Error("Method not implemented.");
    }
    public playerLastKnownState(
        ...args: Parameters<MatchActivityService["playerLastKnownState"]>
    ): ReturnType<MatchActivityService["playerLastKnownState"]> {
        throw new Error("Method not implemented.");
    }
}
