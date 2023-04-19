import { BehaviorSubject, Subject } from "rxjs";
import { ExtractSubjectType } from "../../../../../../../../common/types/rxjs-utilities";
import { OverwolfFeatureDep } from "../../../../common/feature-status";
import { OverwolfGameDataService } from "../../overwolf";

export class MockOverwolfGameDataService implements MockedClass<OverwolfGameDataService> {
    public gameInfo$: OverwolfGameDataService["gameInfo$"] = new BehaviorSubject<ExtractSubjectType<OverwolfGameDataService["gameInfo$"]>>(
        undefined
    );
    public infoUpdates$: OverwolfGameDataService["infoUpdates$"] = new Subject();
    public newGameEvent$: OverwolfGameDataService["newGameEvent$"] = new Subject();

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
