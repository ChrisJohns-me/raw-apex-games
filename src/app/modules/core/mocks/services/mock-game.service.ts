import { GamePhase } from "@shared/models/game-phase";
import { BehaviorSubject } from "rxjs";

export class MockGameService {
    public readonly phase$ = new BehaviorSubject<GamePhase>(GamePhase.Lobby);
}
