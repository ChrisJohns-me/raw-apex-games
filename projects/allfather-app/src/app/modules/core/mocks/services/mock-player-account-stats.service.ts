import { OverwolfFeatureDep } from "@allfather-app/app/common/feature-status";
import { PlayerAccountStatsService } from "@allfather-app/app/modules/core/player-account-stats/player-account-stats.service";
import { of } from "rxjs";

export class MockPlayerAccountStatsService implements MockedClass<PlayerAccountStatsService> {
    public clearCache(): void {}

    public getBulkPlayerAccountStats$(
        ...args: Parameters<PlayerAccountStatsService["getBulkPlayerAccountStats$"]>
    ): ReturnType<PlayerAccountStatsService["getBulkPlayerAccountStats$"]> {
        return of();
    }

    public getPlayerAccountStats$(
        ...args: Parameters<PlayerAccountStatsService["getPlayerAccountStats$"]>
    ): ReturnType<PlayerAccountStatsService["getPlayerAccountStats$"]> {
        return of();
    }

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
