import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedAppModule } from "@shared-app/shared-app.module";
import { SirenSharedModule } from "@siren-app/app/shared/siren-shared.module";
import { GameDataPaneComponent } from "./components/game-data-pane/game-data-pane.component";
import { GameSimulatorComponent } from "./components/game-simulator/game-simulator.component";
import { ReportPlayersComponent } from "./components/reported-players/report-players.component";
import { DevelopmentToolsWindowComponent } from "./windows/development-tools-window.component";

@NgModule({
    declarations: [DevelopmentToolsWindowComponent, ReportPlayersComponent, GameSimulatorComponent, GameDataPaneComponent],
    imports: [SirenSharedModule, SharedAppModule, ReactiveFormsModule],
    exports: [DevelopmentToolsWindowComponent],
})
export class DevelopmentToolsModule {}
