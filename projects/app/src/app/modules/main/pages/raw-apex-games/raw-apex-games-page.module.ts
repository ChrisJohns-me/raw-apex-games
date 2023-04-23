import { RawApexGamesSharedModule } from "#app/shared/app-shared.module.js";
import { SharedModule } from "#shared/angular/shared.module.js";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { LobbyCodeComponent } from "./components/lobby-code.component.js";
import { RawApexGamesPageComponent } from "./raw-apex-games-page.component.js";

@NgModule({
    declarations: [RawApexGamesPageComponent, LobbyCodeComponent],
    imports: [CommonModule, ReactiveFormsModule, RawApexGamesSharedModule, SharedModule],
    providers: [],
    exports: [RawApexGamesPageComponent],
})
export class RawApexGamesPageModule {}
