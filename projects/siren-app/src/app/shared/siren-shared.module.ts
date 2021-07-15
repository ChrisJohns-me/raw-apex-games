import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedAppModule } from "@shared-app/shared-app.module";
import { BootstrapCSSInjectorComponent } from "./components/ui-container/bootstrap-css-injector/bootstrap-css-injector.component";
import { UIContainerComponent } from "./components/ui-container/ui-container.component";

// const DIRECTIVES = [];
// const PIPES = [];
const COMPONENTS = [BootstrapCSSInjectorComponent, UIContainerComponent];
// const THIRDPARTYMODULES = [];

@NgModule({
    declarations: [...COMPONENTS],
    imports: [BrowserAnimationsModule, CommonModule, SharedAppModule],
    exports: [...COMPONENTS, CommonModule],
})
export class SirenSharedModule {}
