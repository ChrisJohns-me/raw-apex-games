import { AllfatherSharedModule } from "@allfather-app/app/shared/allfather-shared.module";
import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { MiniInventoryWindowComponent } from "./windows/mini-inventory-window.component";

@NgModule({
    declarations: [MiniInventoryWindowComponent],
    imports: [AllfatherSharedModule, SharedModule],
    exports: [MiniInventoryWindowComponent],
})
export class MiniInventoryWindowModule {}
