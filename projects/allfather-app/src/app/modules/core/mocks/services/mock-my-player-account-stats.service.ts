import { OverwolfFeatureDep } from "@allfather-app/app/common/feature-status";
import { ExtractSubjectType } from "common/types/rxjs-utilities";
import { BehaviorSubject } from "rxjs";
import { MyPlayerAccountStatsService } from "../../player-account-stats/my-player-account-stats.service";

export class MockMyPlayerAccountStatsService implements MockedClass<MyPlayerAccountStatsService> {
    public myAccountStats$ = new BehaviorSubject<ExtractSubjectType<MyPlayerAccountStatsService["myAccountStats$"]>>(undefined);

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
