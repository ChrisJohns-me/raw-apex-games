import { OverwolfFeatureDep } from "@raw-apex-games-app/app/common/feature-status";
import { OverwolfGameDataService } from "@raw-apex-games-app/app/modules/core/overwolf";
import { ExtractSubjectType } from "common/types/rxjs-utilities";
import { BehaviorSubject, Subject } from "rxjs";

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
