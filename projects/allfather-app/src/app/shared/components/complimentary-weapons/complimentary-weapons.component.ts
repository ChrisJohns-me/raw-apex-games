import { WeaponItem } from "@allfather-app/app/common/items/weapon-item";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-complimentary-weapons",
    templateUrl: "./complimentary-weapons.component.html",
    styleUrls: ["./complimentary-weapons.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplimentaryWeaponsComponent {
    @Input("complimentaryWeaponsAvgEliminations")
    public set complimentaryWeaponIdsAvgEliminations(value: { weaponId: string; avgEliminations: number }[]) {
        this.complimentaryWeaponsAvgEliminations = value.map(({ weaponId, avgEliminations }) => ({
            weapon: new WeaponItem({ fromId: weaponId }),
            avgEliminations,
        }));
    }
    public complimentaryWeaponsAvgEliminations: { weapon: WeaponItem; avgEliminations: number }[] = [];
}
