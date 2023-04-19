import { BehaviorSubject } from "rxjs";
import { ExtractSubjectType } from "../../../../../../../../common/types/rxjs-utilities";
import { OverwolfFeatureDep } from "../../../../common/feature-status";
import { PlayerService } from "../../player.service";

export class MockPlayerService implements MockedClass<PlayerService> {
    public myName$: PlayerService["myName$"] = new BehaviorSubject<ExtractSubjectType<PlayerService["myName$"]>>(undefined);

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
