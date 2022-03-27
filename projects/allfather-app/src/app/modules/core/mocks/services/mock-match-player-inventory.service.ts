import { OverwolfFeatureDep } from "@allfather-app/app/common/feature-status";
import { ExtractSubjectType } from "common/types/rxjs-utilities";
import { BehaviorSubject } from "rxjs";
import { MatchPlayerInventoryService } from "../../match/match-player-inventory.service";

export class MockMatchPlayerInventoryService implements MockedClass<MatchPlayerInventoryService> {
    public myInUseItem$: MatchPlayerInventoryService["myInUseItem$"] = new BehaviorSubject<
        ExtractSubjectType<MatchPlayerInventoryService["myInUseItem$"]>
    >(undefined);
    public myWeaponSlots$: MatchPlayerInventoryService["myWeaponSlots$"] = new BehaviorSubject<
        ExtractSubjectType<MatchPlayerInventoryService["myWeaponSlots$"]>
    >({});
    public myInventorySlots$: MatchPlayerInventoryService["myInventorySlots$"] = new BehaviorSubject<
        ExtractSubjectType<MatchPlayerInventoryService["myInventorySlots$"]>
    >({});

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
