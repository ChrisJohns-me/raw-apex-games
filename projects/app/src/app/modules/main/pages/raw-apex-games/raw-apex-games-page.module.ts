import { RawApexGamesSharedModule } from "#app/shared/app-shared.module.js";
import { SharedModule } from "#shared/angular/shared.module.js";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LobbyCodeComponent } from "./components/lobby-code.component.js";
import { PlaylistSelectorComponent } from "./components/playlist-selector.component.js";
import { RawApexGamesPageComponent } from "./raw-apex-games-page.component.js";
import { MainViewComponent } from "./views/main-view.component.js";
import { OrganizerViewComponent } from "./views/organizer-view.component.js";
import { PlayerLobbyViewComponent } from "./views/player-lobby-view.component.js";

const COMPONENTS = [LobbyCodeComponent, PlaylistSelectorComponent];

const VIEWS = [MainViewComponent, OrganizerViewComponent, PlayerLobbyViewComponent];

@NgModule({
    declarations: [RawApexGamesPageComponent, ...VIEWS, ...COMPONENTS],
    imports: [CommonModule, ReactiveFormsModule, FormsModule, RawApexGamesSharedModule, SharedModule],
    providers: [],
    exports: [RawApexGamesPageComponent],
})
export class RawApexGamesPageModule {}
