import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RawApexGamesSharedModule } from "@raw-apex-games-app/app/shared/raw-apex-games-shared.module";
import { LobbyStatusWindowComponent } from "./windows/lobby-status-window.component";

@NgModule({
    declarations: [LobbyStatusWindowComponent],
    imports: [ReactiveFormsModule, RawApexGamesSharedModule],
    exports: [LobbyStatusWindowComponent],
})
export class LobbyStatusWindowModule {}
