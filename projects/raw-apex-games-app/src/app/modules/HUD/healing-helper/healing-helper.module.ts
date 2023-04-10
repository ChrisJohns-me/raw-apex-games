import { NgModule } from "@angular/core";
import { RawApexGamesSharedModule } from "@raw-apex-games-app/app/shared/raw-apex-games-shared.module";
import { SharedModule } from "@shared/shared.module";
import { HealingHelperWindowComponent } from "./windows/healing-helper-window.component";

@NgModule({
    declarations: [HealingHelperWindowComponent],
    imports: [RawApexGamesSharedModule, SharedModule],
    exports: [HealingHelperWindowComponent],
})
export class HealingHelperWindowModule {}
