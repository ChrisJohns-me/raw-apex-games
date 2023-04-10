import { OverwolfFeatureDep } from "@raw-apex-games-app/app/common/feature-status";
import { of } from "rxjs";
import { PlayerLocalStatsService } from "../../player-local-stats.service";

export class MockPlayerLocalStatsService implements MockedClass<PlayerLocalStatsService> {
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

    public getPlayerComplimentaryLegendWeights$(
        ...args: Parameters<PlayerLocalStatsService["getPlayerComplimentaryLegendWeights$"]>
    ): ReturnType<PlayerLocalStatsService["getPlayerComplimentaryLegendWeights$"]> {
        return of();
    }

    public getPlayerComplimentaryWeaponAvgEliminations$(
        ...args: Parameters<PlayerLocalStatsService["getPlayerComplimentaryWeaponAvgEliminations$"]>
    ): ReturnType<PlayerLocalStatsService["getPlayerComplimentaryWeaponAvgEliminations$"]> {
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

    public getLegendComplimentaryLegendWeights$(
        ...args: Parameters<PlayerLocalStatsService["getLegendComplimentaryLegendWeights$"]>
    ): ReturnType<PlayerLocalStatsService["getLegendComplimentaryLegendWeights$"]> {
        return of();
    }

    public getLegendComplimentaryAvgWeaponEliminations$(
        ...args: Parameters<PlayerLocalStatsService["getLegendComplimentaryAvgWeaponEliminations$"]>
    ): ReturnType<PlayerLocalStatsService["getLegendComplimentaryAvgWeaponEliminations$"]> {
        return of();
    }

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        throw new Error("Method not implemented.");
    }

    public areAllFeatureDepsAvailable(): boolean {
        throw new Error("Method not implemented.");
    }
}
