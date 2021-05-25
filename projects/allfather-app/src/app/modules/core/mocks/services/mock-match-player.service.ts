import { OverwolfFeatureDep } from "@allfather-app/app/common/feature-status";
import { PlayerState } from "@allfather-app/app/common/player-state";
import { MatchPlayerService } from "@allfather-app/app/modules/core/match/match-player.service";
import { BehaviorSubject } from "rxjs";
import { ExtractSubjectType } from "shared/types/rxjs-utilities";

export class MockMatchPlayerService implements MockedClass<MatchPlayerService> {
    public myState$: MatchPlayerService["myState$"] = new BehaviorSubject<ExtractSubjectType<MatchPlayerService["myState$"]>>(
        PlayerState.Disconnected
    );
    public get isAlive(): MatchPlayerService["isAlive"] {
        return this.myState$.value === PlayerState.Alive;
    }

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
