import { MatchPlayerService } from "@core/match/match-player.service";
import { PlayerState } from "@shared/models/player-state";
import { BehaviorSubject } from "rxjs";

export class MockMatchPlayerService implements MockedClass<MatchPlayerService> {
    public myState$: MatchPlayerService["myState$"] = new BehaviorSubject<MatchPlayerService["myState$"]["value"]>(
        PlayerState.Disconnected
    );
    public get isAlive(): MatchPlayerService["isAlive"] {
        return this.myState$.value === PlayerState.Alive;
    }

    public start(): void {
        throw new Error("Method not implemented.");
    }
}
