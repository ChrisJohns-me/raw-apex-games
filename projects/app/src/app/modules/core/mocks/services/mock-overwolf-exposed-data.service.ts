import { BehaviorSubject, Subject } from "rxjs";
import { ExtractSubjectType } from "../../../../../../../../common/types/rxjs-utilities";
import { OverwolfFeatureDep } from "../../../../common/feature-status";
import { ExposedOverwolfGameDataService } from "../../overwolf-exposed-data.service";

export class MockExposedOverwolfGameDataService implements MockedClass<ExposedOverwolfGameDataService> {
    public rawGameInfo$: ExposedOverwolfGameDataService["rawGameInfo$"] = new BehaviorSubject<
        ExtractSubjectType<ExposedOverwolfGameDataService["rawGameInfo$"]>
    >(undefined);
    public rawInfoUpdates$: ExposedOverwolfGameDataService["rawInfoUpdates$"] = new Subject();
    public rawNewGameEvent$: ExposedOverwolfGameDataService["rawNewGameEvent$"] = new Subject();

    public injectOnGameInfo(
        ...args: Parameters<ExposedOverwolfGameDataService["injectOnGameInfo"]>
    ): ReturnType<ExposedOverwolfGameDataService["injectOnGameInfo"]> {
        return;
    }

    public injectOnInfoUpdates2(
        ...args: Parameters<ExposedOverwolfGameDataService["injectOnInfoUpdates2"]>
    ): ReturnType<ExposedOverwolfGameDataService["injectOnInfoUpdates2"]> {
        return;
    }

    public injectOnNewGameEvents(
        ...args: Parameters<ExposedOverwolfGameDataService["injectOnNewGameEvents"]>
    ): ReturnType<ExposedOverwolfGameDataService["injectOnNewGameEvents"]> {
        return;
    }

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
