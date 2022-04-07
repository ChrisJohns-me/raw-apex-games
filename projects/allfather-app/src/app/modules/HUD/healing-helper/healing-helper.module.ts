import { AllfatherSharedModule } from "@allfather-app/app/shared/allfather-shared.module";
import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { HealingHelperWindowComponent } from "./windows/healing-helper-window.component";

@NgModule({
    declarations: [HealingHelperWindowComponent],
    imports: [AllfatherSharedModule, SharedModule],
    exports: [HealingHelperWindowComponent],
})
export class HealingHelperWindowModule {}
