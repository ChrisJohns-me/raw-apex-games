import { OverwolfFeatureDep } from "@raw-apex-games-app/app/common/feature-status";
import { MatchGameModeGenericId } from "@raw-apex-games-app/app/common/match/game-mode/game-mode.enum";
import { MapRotationData } from "@raw-apex-games-app/app/common/match/map/map-rotation-data";
import { MapRotationService } from "@raw-apex-games-app/app/modules/core/map-rotation/map-rotation.service";
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
