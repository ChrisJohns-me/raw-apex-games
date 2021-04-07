import { GameService } from "@core/game.service";
import { GamePhase } from "@shared/models/game-phase";
import { BehaviorSubject } from "rxjs";

export class MockGameService implements MockedClass<GameService> {
    public phase$: GameService["phase$"] = new BehaviorSubject<GameService["phase$"]["value"]>(GamePhase.Lobby);

    public start(): void {
        throw new Error("Method not implemented.");
    }
}
