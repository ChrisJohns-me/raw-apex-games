import { GamePhase } from "@allfather-app/app/common/game-phase";
import { GameService } from "@allfather-app/app/modules/core/game.service";
import { BehaviorSubject } from "rxjs";
import { ExtractSubjectType } from "shared/types/rxjs-utilities";
import { OverwolfFeatureDep } from "../../overwolf/overwolf-feature-status.service";

export class MockGameService implements MockedClass<GameService> {
    public phase$: GameService["phase$"] = new BehaviorSubject<ExtractSubjectType<GameService["phase$"]>>(GamePhase.Lobby);

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
