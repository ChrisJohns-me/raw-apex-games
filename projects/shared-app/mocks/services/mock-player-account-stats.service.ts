import { OverwolfFeatureDep } from "@shared-app/feature-status";
import { MozambiqueherePlatform } from "@shared-app/services/player-account-stats/player-account-stats-mozambiquehere-dto";
import { PlayerAccountStatsService } from "@shared-app/services/player-account-stats/player-account-stats.service";
import { of } from "rxjs";

export class MockPlayerAccountStatsService implements MockedClass<PlayerAccountStatsService> {
    public clearCache(): void {}

    public getBulkPlayerAccountStats$(
        players: { playerName: string; platform: MozambiqueherePlatform }[]
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
