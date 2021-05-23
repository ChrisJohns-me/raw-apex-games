import { of } from "rxjs";
import { PlayerStatsService } from "../../player-stats.service";

export class MockPlayerStatsService implements MockedClass<PlayerStatsService> {
    public clearPlayerCache(): void {}

    public clearLegendCache(): void {}

    public getPlayerStats$(limit?: number, breakCache = false): ReturnType<PlayerStatsService["getPlayerStats$"]> {
        return of();
    }

    public getLegendStats$(legendId: string, limit?: number, breakCache = false): ReturnType<PlayerStatsService["getLegendStats$"]> {
        return of();
    }

    public getPlayerComplimentaryLegendWeights$(
        limit?: number,
        breakCache = false
    ): ReturnType<PlayerStatsService["getPlayerComplimentaryLegendWeights$"]> {
        return of();
    }

    public getLegendComplimentaryLegendWeights$(
        legendId: string,
        limit?: number,
        breakCache = false
    ): ReturnType<PlayerStatsService["getLegendComplimentaryLegendWeights$"]> {
        return of();
    }
}
