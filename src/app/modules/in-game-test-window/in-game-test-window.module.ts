import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { InGameTestWindowComponent } from "./in-game-test-window.component";

@NgModule({
    declarations: [InGameTestWindowComponent],
    imports: [CommonModule],
    exports: [InGameTestWindowComponent],
})
export class InGameTestWindowModule {}
