import { OverwolfGameDataService } from "@allfather-app/app/modules/core/overwolf";
import { BehaviorSubject, Subject } from "rxjs";
import { ExtractSubjectType } from "shared/types/rxjs-utilities";

export class MockOverwolfGameDataService implements MockedClass<OverwolfGameDataService> {
    public gameInfo$: OverwolfGameDataService["gameInfo$"] = new BehaviorSubject<ExtractSubjectType<OverwolfGameDataService["gameInfo$"]>>(
        undefined
    );
    public infoUpdates$: OverwolfGameDataService["infoUpdates$"] = new Subject();
    public newGameEvent$: OverwolfGameDataService["newGameEvent$"] = new Subject();

    public init(): void {
        throw new Error("Method not implemented.");
    }
}
