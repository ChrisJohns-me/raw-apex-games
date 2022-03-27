import { OverwolfFeatureDep } from "@allfather-app/app/common/feature-status";
import { MatchGameModeGenericId } from "@allfather-app/app/common/match/game-mode/game-mode.enum";
import { PlayerLocalStatsService } from "@allfather-app/app/modules/core/player-local-stats.service";
import { AvgMatchStats } from "@allfather-app/app/modules/core/utilities/match-stats";
import { Observable, of } from "rxjs";

export class MockPlayerStatsService implements MockedClass<PlayerLocalStatsService> {
    public clearPlayerCache(): void {}

    public clearLegendCache(): void {}

    public getPlayerStats$(limit?: number, breakCache = false): ReturnType<PlayerLocalStatsService["getPlayerStats$"]> {
        return of();
    }

    public getPlayerGameModeGenericStats$(
        gameModeGenericIds: MatchGameModeGenericId[],
        limit?: number,
        breakCache?: boolean
    ): Observable<AvgMatchStats> {
        return of();
    }

    public getLegendStats$(legendId: string, limit?: number, breakCache = false): ReturnType<PlayerLocalStatsService["getLegendStats$"]> {
        return of();
    }

    public getLegendGameModeGenericStats$(
        legendId: string,
        gameModeGenericIds: MatchGameModeGenericId[],
        limit?: number,
        breakCache?: boolean
    ): Observable<AvgMatchStats> {
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
