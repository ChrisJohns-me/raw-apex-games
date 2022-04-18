import { AllfatherSharedModule } from "@allfather-app/app/shared/allfather-shared.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@shared/shared.module";
import { MatchExplorerPageComponent } from "./match-explorer-page.component";

@NgModule({
    declarations: [MatchExplorerPageComponent],
    imports: [CommonModule, ReactiveFormsModule, AllfatherSharedModule, SharedModule],
    providers: [],
    exports: [MatchExplorerPageComponent],
})
export class MatchExplorerPageModule {}
