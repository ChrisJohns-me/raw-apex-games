import { OverwolfGameDataService } from "@allfather-app/app/modules/core/overwolf";
import { BehaviorSubject, Subject } from "rxjs";

export class MockOverwolfGameDataService implements MockedClass<OverwolfGameDataService> {
    public gameInfo$: OverwolfGameDataService["gameInfo$"] = new BehaviorSubject<OverwolfGameDataService["gameInfo$"]["value"]>(undefined);
    public infoUpdates$: OverwolfGameDataService["infoUpdates$"] = new Subject();
    public newGameEvent$: OverwolfGameDataService["newGameEvent$"] = new Subject();

    public start(): void {
        throw new Error("Method not implemented.");
    }
}
