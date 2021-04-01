import { OWGameEvent, OWInfoUpdates2Event, OWRunningGameInfo } from "@core/overwolf-data-provider/overwolf-types";
import { BehaviorSubject, Subject } from "rxjs";

export class MockOverwolfDataProviderService {
    public gameInfo$ = new BehaviorSubject<Optional<OWRunningGameInfo>>(undefined);
    public infoUpdates$ = new Subject<OWInfoUpdates2Event>();
    public newGameEvent$ = new Subject<OWGameEvent>();

    constructor() {
        //
    }

    public start(): void {
        //
    }
}
