import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RawApexGamesSharedModule } from "@app/app/shared/raw-apex-games-shared.module";
import { SharedModule } from "@shared/shared.module";
import { FirstRunPageComponent } from "./first-run-page.component";

@NgModule({
    declarations: [FirstRunPageComponent],
    imports: [CommonModule, RawApexGamesSharedModule, SharedModule],
    providers: [],
    exports: [FirstRunPageComponent],
})
export class FirstRunPageModule {}
