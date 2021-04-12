import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { PreferencesWindowComponent } from "./windows/preferences-window.component";

@NgModule({
    declarations: [PreferencesWindowComponent],
    imports: [CommonModule],
    exports: [PreferencesWindowComponent],
})
export class PreferencesModule {}
