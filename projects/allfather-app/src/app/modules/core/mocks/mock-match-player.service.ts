import { OverwolfFeatureDep } from "@shared-app/feature-status";
import { PlayerState } from "@shared-app/player-state";
import { ExtractSubjectType } from "common/types/rxjs-utilities";
import { BehaviorSubject } from "rxjs";
import { MatchPlayerService } from "../match/match-player.service";

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
