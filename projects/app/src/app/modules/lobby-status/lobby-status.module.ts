import { RawApexGamesSharedModule } from "#app/shared/app-shared.module.js";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { LobbyStatusWindowComponent } from "./windows/lobby-status-window.component";

@NgModule({
    declarations: [LobbyStatusWindowComponent],
    imports: [ReactiveFormsModule, RawApexGamesSharedModule],
    exports: [LobbyStatusWindowComponent],
})
export class LobbyStatusWindowModule {}
