import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { MatchState } from "@allfather-app/app/shared/models/match/match-state";
import { BehaviorSubject, Subject } from "rxjs";

export class MockMatchService implements MockedClass<MatchService> {
    public startedEvent$: MatchService["startedEvent$"] = new Subject();
    public endedEvent$: MatchService["endedEvent$"] = new Subject();
    public state$: MatchService["state$"] = new BehaviorSubject<MatchService["state$"]["value"]>({ state: MatchState.Inactive });
    public gameMode$: MatchService["gameMode$"] = new BehaviorSubject<MatchService["gameMode$"]["value"]>({ id: "", friendlyName: "" });
    public get isActive(): MatchService["isActive"] {
        return this.state$.value.state === MatchState.Active;
    }

    public start(): void {
        throw new Error("Method not implemented.");
    }
}
