import { OverwolfFeatureDep } from "@app/app/common/feature-status";
import { PlayerService } from "@app/app/modules/core/player.service";
import { ExtractSubjectType } from "common/types/rxjs-utilities";
import { BehaviorSubject } from "rxjs";

export class MockPlayerService implements MockedClass<PlayerService> {
    public myName$: PlayerService["myName$"] = new BehaviorSubject<ExtractSubjectType<PlayerService["myName$"]>>(undefined);

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
