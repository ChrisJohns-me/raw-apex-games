import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../../../../../../../shared/shared.module";
import { RawApexGamesSharedModule } from "../../../../shared/app-shared.module";
import { MatchExplorerPageComponent } from "./match-explorer-page.component";

@NgModule({
    declarations: [MatchExplorerPageComponent],
    imports: [CommonModule, ReactiveFormsModule, RawApexGamesSharedModule, SharedModule],
    providers: [],
    exports: [MatchExplorerPageComponent],
})
export class MatchExplorerPageModule {}
