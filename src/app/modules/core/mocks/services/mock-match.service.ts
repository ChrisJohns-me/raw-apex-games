import { MatchGameMode } from "@shared/models/match/match-game-mode";
import { MatchState, MatchStateChangedEvent } from "@shared/models/match/match-state";
import { BehaviorSubject, Subject } from "rxjs";

export class MockMatchService {
    public startedEvent$ = new Subject<MatchStateChangedEvent>();
    public endedEvent$ = new Subject<MatchStateChangedEvent>();
    public state$ = new BehaviorSubject<MatchStateChangedEvent>({ state: MatchState.Inactive });
    public gameMode$ = new BehaviorSubject<MatchGameMode>({ id: "", friendlyName: "" });
    public get isActive(): boolean {
        return this.state$.value.state === MatchState.Active;
    }

    public start(): void {
        //
    }
}
