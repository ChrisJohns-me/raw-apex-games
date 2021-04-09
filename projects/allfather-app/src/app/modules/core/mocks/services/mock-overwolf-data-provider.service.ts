import { OverwolfDataProviderService } from "@allfather-app/app/modules/core/overwolf-data-provider";
import { BehaviorSubject, Subject } from "rxjs";

export class MockOverwolfDataProviderService implements MockedClass<OverwolfDataProviderService> {
    public gameInfo$: OverwolfDataProviderService["gameInfo$"] = new BehaviorSubject<OverwolfDataProviderService["gameInfo$"]["value"]>(
        undefined
    );
    public infoUpdates$: OverwolfDataProviderService["infoUpdates$"] = new Subject();
    public newGameEvent$: OverwolfDataProviderService["newGameEvent$"] = new Subject();

    public start(): void {
        throw new Error("Method not implemented.");
    }
}
