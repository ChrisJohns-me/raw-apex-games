import { BehaviorSubject } from "rxjs";
import { ExtractSubjectType } from "../../../../../../../../common/types/rxjs-utilities";
import { OverwolfFeatureDep } from "../../../../common/feature-status";
import { PlayerState } from "../../../../common/player-state";
import { MatchPlayerService } from "../../match/match-player.service";

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
