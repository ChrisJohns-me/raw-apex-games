import { OverwolfFeatureDep } from "@raw-apex-games-app/app/common/feature-status";
import { PlayerLocalStatsService } from "@raw-apex-games-app/app/modules/core/player-local-stats.service";
import { of } from "rxjs";

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
