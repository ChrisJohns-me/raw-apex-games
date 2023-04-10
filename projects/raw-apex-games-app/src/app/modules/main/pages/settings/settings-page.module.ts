import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { ReticleHelperWindowModule } from "@raw-apex-games-app/app/modules/HUD/reticle-helper/reticle-helper.module";
import { RawApexGamesSharedModule } from "@raw-apex-games-app/app/shared/raw-apex-games-shared.module";
import { SharedModule } from "@shared/shared.module";
import { HotkeyEditorComponent } from "./hotkey-editor/hotkey-editor.component";
import { SettingsPageComponent } from "./settings-page.component";

@NgModule({
    declarations: [SettingsPageComponent, HotkeyEditorComponent],
    imports: [CommonModule, ReactiveFormsModule, ReticleHelperWindowModule, RawApexGamesSharedModule, SharedModule],
    providers: [],
    exports: [SettingsPageComponent],
})
export class SettingsPageModule {}
