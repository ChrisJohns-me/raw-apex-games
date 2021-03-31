import { BehaviorSubject } from "rxjs";

export class MockMatchPlayerStatsService {
    public readonly myEliminations = new BehaviorSubject<number>(0);
    public readonly myAssists$ = new BehaviorSubject<number>(0);
    public readonly myDamage$ = new BehaviorSubject<number>(0);
    public readonly myPlacement$ = new BehaviorSubject<number>(0);
    public readonly victory$ = new BehaviorSubject<boolean>(false);
    public readonly mySpectators$ = new BehaviorSubject<number>(0);
    public readonly myTotalDamageDealt$ = new BehaviorSubject<number>(0);
}
