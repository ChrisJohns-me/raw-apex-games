import { PlayerLocalStatsService } from "@allfather-app/app/modules/core/player-local-stats.service";
import { OverwolfFeatureDep } from "@shared-app/feature-status";
import { of } from "rxjs";

export class MockPlayerStatsService implements MockedClass<PlayerLocalStatsService> {
    public clearPlayerCache(): void {}

    public clearLegendCache(): void {}

    public getPlayerStats$(limit?: number, breakCache = false): ReturnType<PlayerLocalStatsService["getPlayerStats$"]> {
        return of();
    }

    public getLegendStats$(legendId: string, limit?: number, breakCache = false): ReturnType<PlayerLocalStatsService["getLegendStats$"]> {
        return of();
    }

    public getPlayerComplimentaryLegendWeights$(
        limit?: number,
        breakCache = false
    ): ReturnType<PlayerLocalStatsService["getPlayerComplimentaryLegendWeights$"]> {
        return of();
    }

    public getLegendComplimentaryLegendWeights$(
        legendId: string,
        limit?: number,
        breakCache = false
    ): ReturnType<PlayerLocalStatsService["getLegendComplimentaryLegendWeights$"]> {
        return of();
    }

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
