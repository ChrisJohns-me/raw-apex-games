import { BehaviorSubject, Subject } from "rxjs";
import { ExtractSubjectType } from "../../../../../../../../common/types/rxjs-utilities";
import { OverwolfFeatureDep } from "../../../../common/feature-status";
import { MatchPlayerLegendService } from "../../match/match-player-legend.service";

export class MockMatchPlayerLegendService implements MockedClass<MatchPlayerLegendService> {
    public myLegend$: MatchPlayerLegendService["myLegend$"] = new BehaviorSubject<
        ExtractSubjectType<MatchPlayerLegendService["myLegend$"]>
    >(undefined);
    public myUltimateCooldown$: MatchPlayerLegendService["myUltimateCooldown$"] = new Subject();
    public myUltimateUsage$: MatchPlayerLegendService["myUltimateUsage$"] = new Subject();

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
