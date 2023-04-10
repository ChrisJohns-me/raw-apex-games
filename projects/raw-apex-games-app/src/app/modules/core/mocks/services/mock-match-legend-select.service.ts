import { OverwolfFeatureDep } from "@raw-apex-games-app/app/common/feature-status";
import { Subject } from "rxjs";
import { MatchLegendSelectService } from "../../match/match-legend-select.service";

export class MockMatchLegendSelectService implements MockedClass<MatchLegendSelectService> {
    public legendSelected$: MatchLegendSelectService["legendSelected$"] = new Subject();

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
