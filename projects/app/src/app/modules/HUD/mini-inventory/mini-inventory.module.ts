import { NgModule } from "@angular/core";
import { RawApexGamesSharedModule } from "@app/app/shared/app-shared.module";
import { SharedModule } from "@shared/shared.module";
import { MiniInventoryWindowComponent } from "./windows/mini-inventory-window.component";

@NgModule({
    declarations: [MiniInventoryWindowComponent],
    imports: [RawApexGamesSharedModule, SharedModule],
    exports: [MiniInventoryWindowComponent],
})
export class MiniInventoryWindowModule {}
