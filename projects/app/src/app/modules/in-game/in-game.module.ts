import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RawApexGamesSharedModule } from "@app/app/shared/app-shared.module";
import { InGameWindowComponent } from "./windows/in-game-window.component";

@NgModule({
    declarations: [InGameWindowComponent],
    imports: [ReactiveFormsModule, RawApexGamesSharedModule],
    exports: [InGameWindowComponent],
})
export class InGameWindowModule {}
