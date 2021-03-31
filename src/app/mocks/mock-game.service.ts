import { GamePhase } from "@common/game-phase";
import { BehaviorSubject } from "rxjs";

export class MockGameService {
    public readonly phase$ = new BehaviorSubject<GamePhase>(GamePhase.Lobby);
}
