import { ExposedOverwolfGameDataService } from "@allfather-app/app/modules/core/overwolf-exposed-data.service";
import { BehaviorSubject, Subject } from "rxjs";
import { ExtractSubjectType } from "shared/types/rxjs-utilities";

export class MockExposedOverwolfGameDataService implements MockedClass<ExposedOverwolfGameDataService> {
    public rawGameInfo$: ExposedOverwolfGameDataService["rawGameInfo$"] = new BehaviorSubject<
        ExtractSubjectType<ExposedOverwolfGameDataService["rawGameInfo$"]>
    >(undefined);
    public rawInfoUpdates$: ExposedOverwolfGameDataService["rawInfoUpdates$"] = new Subject();
    public rawNewGameEvent$: ExposedOverwolfGameDataService["rawNewGameEvent$"] = new Subject();

    public init(): void {
        throw new Error("Method not implemented.");
    }

    public injectOnGameInfo(
        ...args: Parameters<ExposedOverwolfGameDataService["injectOnGameInfo"]>
    ): ReturnType<ExposedOverwolfGameDataService["injectOnGameInfo"]> {
        throw new Error("Method not implemented.");
    }

    public injectOnInfoUpdates2(
        ...args: Parameters<ExposedOverwolfGameDataService["injectOnInfoUpdates2"]>
    ): ReturnType<ExposedOverwolfGameDataService["injectOnInfoUpdates2"]> {
        throw new Error("Method not implemented.");
    }

    public injectOnNewGameEvents(
        ...args: Parameters<ExposedOverwolfGameDataService["injectOnNewGameEvents"]>
    ): ReturnType<ExposedOverwolfGameDataService["injectOnNewGameEvents"]> {
        throw new Error("Method not implemented.");
    }
}
