import { RawApexGamesSharedModule } from "#app/shared/app-shared.module.js";
import { SharedModule } from "#shared/angular/shared.module.js";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { LobbyCodeComponent } from "./components/lobby-code.component.js";
import { InGameWindowComponent } from "./windows/in-game-window.component.js";

@NgModule({
    declarations: [InGameWindowComponent, LobbyCodeComponent],
    imports: [ReactiveFormsModule, RawApexGamesSharedModule, SharedModule],
    exports: [InGameWindowComponent],
})
export class InGameWindowModule {}
