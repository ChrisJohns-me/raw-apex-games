import { BehaviorSubject } from "rxjs";
import { ExtractSubjectType } from "../../../../../../../../common/types/rxjs-utilities";
import { OverwolfFeatureDep } from "../../../../common/feature-status";
import { GameProcessService } from "../../game-process.service";

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
