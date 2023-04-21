import { RawApexGamesSharedModule } from "#app/shared/app-shared.module.js";
import { SharedModule } from "#shared/angular/shared.module.js";
import { NgModule } from "@angular/core";
import { MiniInventoryWindowComponent } from "./windows/mini-inventory-window.component.js";

@NgModule({
    declarations: [MiniInventoryWindowComponent],
    imports: [RawApexGamesSharedModule, SharedModule],
    exports: [MiniInventoryWindowComponent],
})
export class MiniInventoryWindowModule {}
