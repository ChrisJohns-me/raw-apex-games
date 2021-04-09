import { MatchPlayerLegendService } from "@allfather-app/app/modules/core/match/match-player-legend.service";
import { BehaviorSubject, Subject } from "rxjs";

export class MockMatchPlayerLegendService implements MockedClass<MatchPlayerLegendService> {
    public myLegend$: MatchPlayerLegendService["myLegend$"] = new BehaviorSubject<MatchPlayerLegendService["myLegend$"]["value"]>(
        undefined
    );
    public myUltimateCooldown$: MatchPlayerLegendService["myUltimateCooldown$"] = new Subject();

    public start(): void {
        throw new Error("Method not implemented.");
    }
}
