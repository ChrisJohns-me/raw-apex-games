import { OverwolfFeatureDep } from "@shared-app/feature-status";
import { GamePhase } from "@shared-app/game-phase";
import { GameService } from "@shared-app/services/game.service";
import { ExtractSubjectType } from "common/types/rxjs-utilities";
import { BehaviorSubject } from "rxjs";

export class MockGameService implements MockedClass<GameService> {
    public phase$: GameService["phase$"] = new BehaviorSubject<ExtractSubjectType<GameService["phase$"]>>(GamePhase.Lobby);

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
