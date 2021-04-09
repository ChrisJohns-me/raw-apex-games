import { OverwolfExposedDataService } from "@allfather-app/app/modules/core/overwolf-exposed-data.service";
import { BehaviorSubject, Subject } from "rxjs";

export class MockOverwolfExposedDataService implements MockedClass<OverwolfExposedDataService> {
    public rawGameInfo$: OverwolfExposedDataService["rawGameInfo$"] = new BehaviorSubject<
        OverwolfExposedDataService["rawGameInfo$"]["value"]
    >(undefined);
    public rawInfoUpdates$: OverwolfExposedDataService["rawInfoUpdates$"] = new Subject();
    public rawNewGameEvent$: OverwolfExposedDataService["rawNewGameEvent$"] = new Subject();

    public start(): void {
        throw new Error("Method not implemented.");
    }

    public injectOnGameInfo(
        ...args: Parameters<OverwolfExposedDataService["injectOnGameInfo"]>
    ): ReturnType<OverwolfExposedDataService["injectOnGameInfo"]> {
        throw new Error("Method not implemented.");
    }

    public injectOnInfoUpdates2(
        ...args: Parameters<OverwolfExposedDataService["injectOnInfoUpdates2"]>
    ): ReturnType<OverwolfExposedDataService["injectOnInfoUpdates2"]> {
        throw new Error("Method not implemented.");
    }

    public injectOnNewGameEvents(
        ...args: Parameters<OverwolfExposedDataService["injectOnNewGameEvents"]>
    ): ReturnType<OverwolfExposedDataService["injectOnNewGameEvents"]> {
        throw new Error("Method not implemented.");
    }
}
