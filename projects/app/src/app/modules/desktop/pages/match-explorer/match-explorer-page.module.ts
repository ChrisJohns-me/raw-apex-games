import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RawApexGamesSharedModule } from "@app/app/shared/raw-apex-games-shared.module";
import { SharedModule } from "@shared/shared.module";
import { MatchExplorerPageComponent } from "./match-explorer-page.component";

@NgModule({
    declarations: [MatchExplorerPageComponent],
    imports: [CommonModule, ReactiveFormsModule, RawApexGamesSharedModule, SharedModule],
    providers: [],
    exports: [MatchExplorerPageComponent],
})
export class MatchExplorerPageModule {}
