import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { InGameUltimateCountdownWindowComponent } from "./in-game-ultimate-countdown-window.component";

@NgModule({
    declarations: [InGameUltimateCountdownWindowComponent],
    imports: [SharedModule],
    exports: [InGameUltimateCountdownWindowComponent],
})
export class InGameUltimateCountdownWindowModule {}
