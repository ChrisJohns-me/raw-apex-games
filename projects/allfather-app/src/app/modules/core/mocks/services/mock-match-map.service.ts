import { OverwolfFeatureDep } from "@allfather-app/app/common/feature-status";
import { MatchGameModeType } from "@allfather-app/app/common/match/game-mode";
import { MapRotation } from "@allfather-app/app/common/match/map/map-rotation";
import { MatchMapService } from "@allfather-app/app/modules/core/match/match-map.service";
import { BehaviorSubject, of } from "rxjs";
import { ExtractSubjectType } from "shared/types/rxjs-utilities";

export class MockMatchMapService implements MockedClass<MatchMapService> {
    public map$: MatchMapService["map$"] = new BehaviorSubject<ExtractSubjectType<MatchMapService["map$"]>>(undefined);

    public mapRotation$: MatchMapService["mapRotation$"] = new BehaviorSubject<Optional<MapRotation>>(undefined);

    public getCurrentMap(gameModeType: MatchGameModeType): ReturnType<MatchMapService["getCurrentMap"]> {
        return;
    }

    public getNextMap(gameModeType: MatchGameModeType): ReturnType<MatchMapService["getNextMap"]> {
        return;
    }

    public getMapRotation$(breakCache?: boolean): ReturnType<MatchMapService["getMapRotation$"]> {
        return of();
    }

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
