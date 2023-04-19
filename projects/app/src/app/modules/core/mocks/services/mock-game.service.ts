import { BehaviorSubject } from "rxjs";
import { ExtractSubjectType } from "../../../../../../../../common/types/rxjs-utilities";
import { OverwolfFeatureDep } from "../../../../common/feature-status";
import { GamePhase } from "../../../../common/game-phase";
import { GameService } from "../../game.service";
import { OverwolfFeatureStatusService } from "../../overwolf/overwolf-feature-status.service";

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
