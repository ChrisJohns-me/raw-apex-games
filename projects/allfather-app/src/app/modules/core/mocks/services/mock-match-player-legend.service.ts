import { OverwolfFeatureDep } from "@allfather-app/app/common/feature-status";
import { MatchPlayerLegendService } from "@allfather-app/app/modules/core/match/match-player-legend.service";
import { ExtractSubjectType } from "common/types/rxjs-utilities";
import { BehaviorSubject, Subject } from "rxjs";

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
