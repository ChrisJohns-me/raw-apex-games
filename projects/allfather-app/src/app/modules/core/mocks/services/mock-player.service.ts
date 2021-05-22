import { PlayerService } from "@allfather-app/app/modules/core/player.service";
import { BehaviorSubject } from "rxjs";
import { ExtractSubjectType } from "shared/types/rxjs-utilities";
import { OverwolfFeatureDep } from "../../overwolf/overwolf-feature-status.service";

export class MockPlayerService implements MockedClass<PlayerService> {
    public myName$: PlayerService["myName$"] = new BehaviorSubject<ExtractSubjectType<PlayerService["myName$"]>>(undefined);

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
