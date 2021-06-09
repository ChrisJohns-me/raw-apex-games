import { SharedModule } from "@allfather-app/app/shared/shared.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { SettingsPageComponent } from "./settings-page.component";

@NgModule({
    declarations: [SettingsPageComponent],
    imports: [CommonModule, ReactiveFormsModule, SharedModule],
    providers: [],
    exports: [SettingsPageComponent],
})
export class SettingsPageModule {}
