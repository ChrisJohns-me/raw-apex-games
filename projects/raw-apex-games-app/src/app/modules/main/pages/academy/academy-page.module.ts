import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RawApexGamesSharedModule } from "@raw-apex-games-app/app/shared/raw-apex-games-shared.module";
import { SharedModule } from "@shared/shared.module";
import { AcademyPageComponent } from "./academy-page.component";

@NgModule({
    declarations: [AcademyPageComponent],
    imports: [CommonModule, RawApexGamesSharedModule, SharedModule],
    providers: [],
    exports: [AcademyPageComponent],
})
export class AcademyPageModule {}
