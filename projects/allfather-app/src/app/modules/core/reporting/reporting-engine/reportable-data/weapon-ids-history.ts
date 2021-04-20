import { WeaponItem } from "@allfather-app/app/shared/models/items/weapon-item";
import { map } from "rxjs/operators";
import { MatchPlayerInventoryService } from "../../../match/match-player-inventory.service";
import { ReportableDataTimestampedStream } from "../reportable-data";

type WeaponIdsHistoryDataOutput = { [id: number]: string };
export function WeaponIdsHistoryDataFactory(
    weaponObs: MatchPlayerInventoryService["myWeaponSlots$"]
): ReportableDataTimestampedStream<WeaponIdsHistoryDataOutput> {
    return new ReportableDataTimestampedStream({
        dataId: "weaponIdsHistory",
        source$: weaponObs.pipe(
            map((weaponSlots) => {
                return Object.values(weaponSlots).map((weapon: WeaponItem) => weapon.itemId ?? "");
            })
        ),
    });
}
