import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RawApexGamesSharedModule } from "@app/app/shared/app-shared.module";
import { SharedModule } from "@shared/shared.module";
import { GameDataPaneComponent } from "./components/game-data-pane/game-data-pane.component";
import { GameEventsLogComponent } from "./components/game-events-log/game-events-log.component";
import { GameSimulatorComponent } from "./components/game-simulator/game-simulator.component";
import { DevelopmentToolsWindowComponent } from "./windows/development-tools-window.component";

@NgModule({
    declarations: [DevelopmentToolsWindowComponent, GameEventsLogComponent, GameSimulatorComponent, GameDataPaneComponent],
    imports: [ReactiveFormsModule, RawApexGamesSharedModule, SharedModule],
    exports: [DevelopmentToolsWindowComponent],
})
export class DevelopmentToolsModule {}
