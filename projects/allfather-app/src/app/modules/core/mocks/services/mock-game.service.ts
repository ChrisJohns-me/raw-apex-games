import { OverwolfFeatureDep } from "@allfather-app/app/common/feature-status";
import { GamePhase } from "@allfather-app/app/common/game-phase";
import { OverwolfFeatureStatusService } from "@allfather-app/app/common/services/overwolf/overwolf-feature-status.service";
import { ExtractSubjectType } from "common/types/rxjs-utilities";
import { BehaviorSubject } from "rxjs";
import { GameService } from "../../game.service";

export class MockGameService implements MockedClass<GameService> {
    public phase$: GameService["phase$"] = new BehaviorSubject<ExtractSubjectType<GameService["phase$"]>>(GamePhase.Lobby);

    constructor(public readonly overwolfGameDataStatus: OverwolfFeatureStatusService) {}

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
