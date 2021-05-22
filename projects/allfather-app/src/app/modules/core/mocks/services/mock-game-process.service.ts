import { GameProcessService } from "@allfather-app/app/modules/core/game-process.service";
import { BehaviorSubject } from "rxjs";
import { ExtractSubjectType } from "shared/types/rxjs-utilities";
import { OverwolfFeatureDep } from "../../overwolf/overwolf-feature-status.service";

export class MockGameProcessService implements MockedClass<GameProcessService> {
    public isRunning$: GameProcessService["isRunning$"] = new BehaviorSubject<ExtractSubjectType<GameProcessService["isRunning$"]>>(false);
    public isInFocus$: GameProcessService["isInFocus$"] = new BehaviorSubject<ExtractSubjectType<GameProcessService["isInFocus$"]>>(false);

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
