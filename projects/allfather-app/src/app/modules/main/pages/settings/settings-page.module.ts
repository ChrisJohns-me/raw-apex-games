import { ReticleHelperWindowModule } from "@allfather-app/app/modules/HUD/reticle-helper/reticle-helper.module";
import { SharedModule } from "@allfather-app/app/shared/shared.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { SettingsPageComponent } from "./settings-page.component";

@NgModule({
    declarations: [SettingsPageComponent],
    imports: [CommonModule, ReactiveFormsModule, SharedModule, ReticleHelperWindowModule],
    providers: [],
    exports: [SettingsPageComponent],
})
export class SettingsPageModule {}
