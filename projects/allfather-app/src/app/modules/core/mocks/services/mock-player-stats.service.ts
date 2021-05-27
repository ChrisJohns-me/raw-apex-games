import { of } from "rxjs";
import { PlayerLocalStatsService } from "../../player-local-stats.service";

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
}
