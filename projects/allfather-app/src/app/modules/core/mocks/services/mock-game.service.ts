import { GamePhase } from "@allfather-app/app/common/game-phase";
import { GameService } from "@allfather-app/app/modules/core/game.service";
import { BehaviorSubject } from "rxjs";
import { ExtractSubjectType } from "shared/types/rxjs-utilities";

export class MockGameService implements MockedClass<GameService> {
    public phase$: GameService["phase$"] = new BehaviorSubject<ExtractSubjectType<GameService["phase$"]>>(GamePhase.Lobby);

    public init(): void {
        throw new Error("Method not implemented.");
    }
}
