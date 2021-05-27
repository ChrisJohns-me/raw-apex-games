import { OverwolfFeatureDep } from "@allfather-app/app/common/feature-status";
import { MatchGameModeType } from "@allfather-app/app/common/match/game-mode";
import { MapRotationData } from "@allfather-app/app/common/match/map/map-rotation-data";
import { BehaviorSubject, of } from "rxjs";
import { MapRotationService } from "../../map-rotation/map-rotation.service";

export class MockMapRotationService implements MockedClass<MapRotationService> {
    public mapRotation$: MapRotationService["mapRotation$"] = new BehaviorSubject<Optional<MapRotationData>>(undefined);

    public getCurrentMap(gameModeType: MatchGameModeType): ReturnType<MapRotationService["getCurrentMap"]> {
        return;
    }

    public getNextMap(gameModeType: MatchGameModeType): ReturnType<MapRotationService["getNextMap"]> {
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
