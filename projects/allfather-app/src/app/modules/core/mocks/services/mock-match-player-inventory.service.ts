import { MatchPlayerInventoryService } from "@allfather-app/app/modules/core/match/match-player-inventory.service";
import { BehaviorSubject } from "rxjs";

export class MockMatchPlayerInventoryService implements MockedClass<MatchPlayerInventoryService> {
    public myInUseItem$: MatchPlayerInventoryService["myInUseItem$"] = new BehaviorSubject<
        MatchPlayerInventoryService["myInUseItem$"]["value"]
    >(undefined);
    public myWeaponSlots$: MatchPlayerInventoryService["myWeaponSlots$"] = new BehaviorSubject<
        MatchPlayerInventoryService["myWeaponSlots$"]["value"]
    >({});
    public myInventorySlots$: MatchPlayerInventoryService["myInventorySlots$"] = new BehaviorSubject<
        MatchPlayerInventoryService["myInventorySlots$"]["value"]
    >({});

    public start(): void {
        throw new Error("Method not implemented.");
    }
}
