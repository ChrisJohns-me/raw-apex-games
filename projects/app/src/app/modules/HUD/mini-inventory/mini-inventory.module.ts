import { NgModule } from "@angular/core";
import { SharedModule } from "../../../../../../shared/shared.module";
import { RawApexGamesSharedModule } from "../../../shared/app-shared.module";
import { MiniInventoryWindowComponent } from "./windows/mini-inventory-window.component";

@NgModule({
    declarations: [MiniInventoryWindowComponent],
    imports: [RawApexGamesSharedModule, SharedModule],
    exports: [MiniInventoryWindowComponent],
})
export class MiniInventoryWindowModule {}
