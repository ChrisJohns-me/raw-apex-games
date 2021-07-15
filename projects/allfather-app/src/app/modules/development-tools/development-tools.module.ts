import { AllfatherSharedModule } from "@allfather-app/app/shared/allfather-shared.module";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedAppModule } from "@shared-app/shared-app.module";
import { GameDataPaneComponent } from "./components/game-data-pane/game-data-pane.component";
import { GameEventsLogComponent } from "./components/game-events-log/game-events-log.component";
import { GameSimulatorComponent } from "./components/game-simulator/game-simulator.component";
import { DevelopmentToolsWindowComponent } from "./windows/development-tools-window.component";

@NgModule({
    declarations: [DevelopmentToolsWindowComponent, GameEventsLogComponent, GameSimulatorComponent, GameDataPaneComponent],
    imports: [ReactiveFormsModule, SharedAppModule, AllfatherSharedModule],
    exports: [DevelopmentToolsWindowComponent],
})
export class DevelopmentToolsModule {}
