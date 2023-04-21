import { RawApexGamesSharedModule } from "#app/shared/app-shared.module.js";
import { SharedModule } from "#shared/angular/shared.module.js";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { GameDataPaneComponent } from "./components/game-data-pane/game-data-pane.component.js";
import { GameEventsLogComponent } from "./components/game-events-log/game-events-log.component.js";
import { GameSimulatorComponent } from "./components/game-simulator/game-simulator.component.js";
import { DevelopmentToolsWindowComponent } from "./windows/development-tools-window.component.js";

@NgModule({
    declarations: [DevelopmentToolsWindowComponent, GameEventsLogComponent, GameSimulatorComponent, GameDataPaneComponent],
    imports: [ReactiveFormsModule, RawApexGamesSharedModule, SharedModule],
    exports: [DevelopmentToolsWindowComponent],
})
export class DevelopmentToolsModule {}
