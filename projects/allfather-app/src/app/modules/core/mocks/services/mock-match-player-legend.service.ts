import { MatchPlayerLegendService } from "@allfather-app/app/modules/core/match/match-player-legend.service";
import { BehaviorSubject, Subject } from "rxjs";
import { ExtractSubjectType } from "shared/types/rxjs-utilities";

export class MockMatchPlayerLegendService implements MockedClass<MatchPlayerLegendService> {
    public myLegend$: MatchPlayerLegendService["myLegend$"] = new BehaviorSubject<
        ExtractSubjectType<MatchPlayerLegendService["myLegend$"]>
    >(undefined);
    public myUltimateCooldown$: MatchPlayerLegendService["myUltimateCooldown$"] = new Subject();
    public myUltimateUsage$: MatchPlayerLegendService["myUltimateUsage$"] = new Subject();

    public init(): void {
        throw new Error("Method not implemented.");
    }
}
