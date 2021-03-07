import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { InGameDamageCollectorWindowComponent } from "./in-game-damage-collector-window.component";
import { PlayerDamageBoxComponent } from "./player-damage-box/player-damage-box.component";

@NgModule({
    declarations: [InGameDamageCollectorWindowComponent, PlayerDamageBoxComponent],
    providers: [],
    imports: [SharedModule],
    exports: [InGameDamageCollectorWindowComponent],
})
export class InGameDamageCollectorWindowModule {}
