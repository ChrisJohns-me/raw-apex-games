import { OverwolfFeatureDep } from "@shared-app/feature-status";
import { ExposedOverwolfGameDataService } from "@shared-app/services/overwolf-exposed-data.service";
import { ExtractSubjectType } from "common/types/rxjs-utilities";
import { BehaviorSubject, Subject } from "rxjs";

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
