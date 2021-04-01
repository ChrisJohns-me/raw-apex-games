import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { PlayerDamageBoxComponent } from "./components/player-damage-box/player-damage-box.component";
import { DamageCollectorWindowComponent } from "./windows/damage-collector-window.component";

@NgModule({
    declarations: [DamageCollectorWindowComponent, PlayerDamageBoxComponent],
    providers: [],
    imports: [SharedModule],
    exports: [DamageCollectorWindowComponent],
})
export class DamageCollectorWindowModule {}
