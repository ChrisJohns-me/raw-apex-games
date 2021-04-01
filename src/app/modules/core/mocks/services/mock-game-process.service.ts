import { BehaviorSubject } from "rxjs";

export class MockGameProcessService {
    public isRunning$ = new BehaviorSubject<boolean>(false);
    public isInFocus$ = new BehaviorSubject<boolean>(false);
}
