import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { MatchState } from "@allfather-app/app/shared/models/match/state";
import { BehaviorSubject, Subject } from "rxjs";
import { ExtractSubjectType } from "shared/types/rxjs-utilities";

export class MockMatchService implements MockedClass<MatchService> {
    public matchId$: MatchService["matchId$"] = new BehaviorSubject<ExtractSubjectType<MatchService["matchId$"]>>("");
    public startedEvent$: MatchService["startedEvent$"] = new Subject();
    public endedEvent$: MatchService["endedEvent$"] = new Subject();
    public state$: MatchService["state$"] = new BehaviorSubject<ExtractSubjectType<MatchService["state$"]>>({
        state: MatchState.Inactive,
        matchId: "test",
    });
    public gameMode$: MatchService["gameMode$"] = new BehaviorSubject<ExtractSubjectType<MatchService["gameMode$"]>>({
        gameModeId: "",
        friendlyName: "",
    });
    public get isActive(): MatchService["isActive"] {
        return this.state$.value.state === MatchState.Active;
    }

    public init(): void {
        throw new Error("Method not implemented.");
    }
}
