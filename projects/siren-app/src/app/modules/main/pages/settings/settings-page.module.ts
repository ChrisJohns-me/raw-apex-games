import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedAppModule } from "@shared-app/shared-app.module";
import { SirenSharedModule } from "@siren-app/app/shared/siren-shared.module";
import { SettingsPageComponent } from "./settings-page.component";

@NgModule({
    declarations: [SettingsPageComponent],
    imports: [CommonModule, ReactiveFormsModule, SharedAppModule, SirenSharedModule],
    providers: [],
    exports: [SettingsPageComponent],
})
export class SettingsPageModule {}
