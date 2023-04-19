import { of } from "rxjs";
import { OverwolfFeatureDep } from "../../../../common/feature-status";
import { PlayerLocalStatsService } from "../../player-local-stats.service";

export class MockPlayerStatsService implements MockedClass<PlayerLocalStatsService> {
    public clearPlayerCache(): void {}

    public clearLegendCache(): void {}

    public getPlayerStats$(
        ...args: Parameters<PlayerLocalStatsService["getPlayerStats$"]>
    ): ReturnType<PlayerLocalStatsService["getPlayerStats$"]> {
        return of();
    }

    public getPlayerGameModeGenericStats$(
        ...args: Parameters<PlayerLocalStatsService["getPlayerGameModeGenericStats$"]>
    ): ReturnType<PlayerLocalStatsService["getPlayerGameModeGenericStats$"]> {
        return of();
    }

    public getLegendStats$(
        ...args: Parameters<PlayerLocalStatsService["getLegendStats$"]>
    ): ReturnType<PlayerLocalStatsService["getLegendStats$"]> {
        return of();
    }

    public getLegendGameModeGenericStats$(
        ...args: Parameters<PlayerLocalStatsService["getLegendGameModeGenericStats$"]>
    ): ReturnType<PlayerLocalStatsService["getLegendGameModeGenericStats$"]> {
        return of();
    }

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
