import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { InGameTestWindowComponent } from "./in-game-test-window.component";

@NgModule({
    declarations: [InGameTestWindowComponent],
    imports: [SharedModule],
    exports: [InGameTestWindowComponent],
})
export class InGameTestWindowModule {}
