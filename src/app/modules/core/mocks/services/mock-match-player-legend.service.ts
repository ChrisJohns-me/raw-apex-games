import { Legend } from "@shared/models/legend";
import { BehaviorSubject, Subject } from "rxjs";

export class MockMatchPlayerLegendService {
    public myLegend$ = new BehaviorSubject<Optional<Legend>>(undefined);
    public myUltimateCooldown$ = new Subject<number>();
}
