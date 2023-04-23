import { RawApexGamesSharedModule } from "#app/shared/app-shared.module.js";
import { SharedModule } from "#shared/angular/shared.module.js";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { HotkeyEditorComponent } from "./hotkey-editor/hotkey-editor.component.js";
import { SettingsPageComponent } from "./settings-page.component.js";

@NgModule({
    declarations: [SettingsPageComponent, HotkeyEditorComponent],
    imports: [CommonModule, ReactiveFormsModule, RawApexGamesSharedModule, SharedModule],
    providers: [],
    exports: [SettingsPageComponent],
})
export class SettingsPageModule {}
