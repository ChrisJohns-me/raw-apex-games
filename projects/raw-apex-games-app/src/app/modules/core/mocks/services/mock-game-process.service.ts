import { OverwolfFeatureDep } from "@raw-apex-games-app/app/common/feature-status";
import { GameProcessService } from "@raw-apex-games-app/app/modules/core/game-process.service";
import { ExtractSubjectType } from "common/types/rxjs-utilities";
import { BehaviorSubject } from "rxjs";

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
