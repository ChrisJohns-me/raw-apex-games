import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../../../../../../../shared/shared.module";
import { RawApexGamesSharedModule } from "../../../../shared/app-shared.module";
import { HotkeyEditorComponent } from "./hotkey-editor/hotkey-editor.component";
import { SettingsPageComponent } from "./settings-page.component";

@NgModule({
    declarations: [SettingsPageComponent, HotkeyEditorComponent],
    imports: [CommonModule, ReactiveFormsModule, RawApexGamesSharedModule, SharedModule],
    providers: [],
    exports: [SettingsPageComponent],
})
export class SettingsPageModule {}
