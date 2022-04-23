import { AllfatherSharedModule } from "@allfather-app/app/shared/allfather-shared.module";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { LobbyStatusWindowComponent } from "./windows/lobby-status-window.component";

@NgModule({
    declarations: [LobbyStatusWindowComponent],
    imports: [ReactiveFormsModule, AllfatherSharedModule],
    exports: [LobbyStatusWindowComponent],
})
export class LobbyStatusWindowModule {}
