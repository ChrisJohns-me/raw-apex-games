import { OverwolfFeatureDep } from "@allfather-app/app/common/feature-status";
import { MatchPlayerInventoryService } from "@allfather-app/app/modules/core/match/match-player-inventory.service";
import { BehaviorSubject } from "rxjs";
import { ExtractSubjectType } from "shared/types/rxjs-utilities";

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
