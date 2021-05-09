import { SharedModule } from "@allfather-app/app/shared/shared.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MapExplorerPageComponent } from "./pages/map-explorer-page.component";
import { MainWindowComponent } from "./windows/main-window.component";

@NgModule({
    declarations: [MainWindowComponent, MapExplorerPageComponent],
    imports: [CommonModule, ReactiveFormsModule, SharedModule],
    providers: [],
    exports: [MainWindowComponent],
})
export class MainModule {}
