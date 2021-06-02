import { OverwolfFeatureDep } from "@allfather-app/app/common/feature-status";
import { of } from "rxjs";
import { MozambiqueherePlatform } from "../../player-account-stats/player-account-stats-mozambiquehere-dto";
import { PlayerAccountStatsService } from "../../player-account-stats/player-account-stats.service";

export class MockPlayerAccountStatsService implements MockedClass<PlayerAccountStatsService> {
    public clearCache(): void {}

    public getBulkPlayerAccountStats$(
        playerNames: string[],
        platform: MozambiqueherePlatform
    ): ReturnType<PlayerAccountStatsService["getBulkPlayerAccountStats$"]> {
        return of();
    }

    public getPlayerAccountStats$(
        playerName: string,
        platform: MozambiqueherePlatform,
        breakCache?: boolean
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
