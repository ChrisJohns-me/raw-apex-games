import { GameService } from "@allfather-app/app/modules/core/game.service";
import { GamePhase } from "@allfather-app/app/shared/models/game-phase";
import { BehaviorSubject } from "rxjs";

export class MockGameService implements MockedClass<GameService> {
    public phase$: GameService["phase$"] = new BehaviorSubject<GameService["phase$"]["value"]>(GamePhase.Lobby);

    public start(): void {
        throw new Error("Method not implemented.");
    }
}