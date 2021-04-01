import { BehaviorSubject } from "rxjs";

export class MockPlayerService {
    public myName$ = new BehaviorSubject<Optional<string>>(undefined);
}
