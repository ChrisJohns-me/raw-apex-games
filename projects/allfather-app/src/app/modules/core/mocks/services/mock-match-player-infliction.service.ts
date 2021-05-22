import { MatchPlayerInflictionService } from "@allfather-app/app/modules/core/match/match-player-infliction.service";
import { Subject } from "rxjs";
import { OverwolfFeatureDep } from "../../overwolf/overwolf-feature-status.service";

export class MockMatchPlayerInflictionService implements MockedClass<MatchPlayerInflictionService> {
    public myKillfeedEvent$: MatchPlayerInflictionService["myKillfeedEvent$"] = new Subject();
    public notMyKillfeedEvent$: MatchPlayerInflictionService["notMyKillfeedEvent$"] = new Subject();
    public myDamageEvent$: MatchPlayerInflictionService["myDamageEvent$"] = new Subject();

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
