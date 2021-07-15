import { MapRotationService } from "@allfather-app/app/modules/core/map-rotation/map-rotation.service";
import { OverwolfFeatureDep } from "@shared-app/feature-status";
import { MatchGameModeGenericId } from "@shared-app/match/game-mode/game-mode.enum";
import { MapRotationData } from "@shared-app/match/map/map-rotation-data";
import { BehaviorSubject, of } from "rxjs";

export class MockMapRotationService implements MockedClass<MapRotationService> {
    public mapRotation$: MapRotationService["mapRotation$"] = new BehaviorSubject<Optional<MapRotationData>>(undefined);

    public getCurrentMapFromGameMode(gameModeType: MatchGameModeGenericId): ReturnType<MapRotationService["getCurrentMapFromGameMode"]> {
        return;
    }

    public getNextMap(gameModeType: MatchGameModeGenericId): ReturnType<MapRotationService["getNextMap"]> {
        return;
    }

    public getMapRotation$(breakCache?: boolean): ReturnType<MapRotationService["getMapRotation$"]> {
        return of();
    }

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
