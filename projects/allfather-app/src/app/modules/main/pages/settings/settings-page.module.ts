import { ReticleHelperWindowModule } from "@allfather-app/app/modules/HUD/reticle-helper/reticle-helper.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedAppModule } from "@shared-app/shared-app.module";
import { HotkeyEditorComponent } from "./hotkey-editor/hotkey-editor.component";
import { SettingsPageComponent } from "./settings-page.component";

@NgModule({
    declarations: [SettingsPageComponent, HotkeyEditorComponent],
    imports: [CommonModule, ReactiveFormsModule, SharedAppModule, ReticleHelperWindowModule],
    providers: [],
    exports: [SettingsPageComponent],
})
export class SettingsPageModule {}
