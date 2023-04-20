import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RawApexGamesSharedModule } from "@app/shared/app-shared.module.js";
import { InGameWindowComponent } from "./windows/in-game-window.component.js";

@NgModule({
    declarations: [InGameWindowComponent],
    imports: [ReactiveFormsModule, RawApexGamesSharedModule],
    exports: [InGameWindowComponent],
})
export class InGameWindowModule {}
