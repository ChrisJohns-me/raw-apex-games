import { PlayerState } from "@shared/models/player-state";
import { BehaviorSubject } from "rxjs";

export class MockMatchPlayerService {
    public myState$ = new BehaviorSubject<Optional<PlayerState>>(undefined);
    public get isAlive(): boolean {
        return this.myState$.value === PlayerState.Alive;
    }
}
