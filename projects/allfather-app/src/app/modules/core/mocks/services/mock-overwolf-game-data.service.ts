import { OverwolfGameDataService } from "@allfather-app/app/modules/core/overwolf";
import { BehaviorSubject, Subject } from "rxjs";
import { ExtractSubjectType } from "shared/types/rxjs-utilities";
import { OverwolfFeatureDep } from "../../overwolf/overwolf-feature-status.service";

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
