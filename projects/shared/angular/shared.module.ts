import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { IconComponent } from "./components/icon/icon.component.js";
import { HighlightOnChangeDirective } from "./directives/highlight-on-change.directive.js";
import { CustomFormatDistanceToNowPipe } from "./pipes/custom-format-distance-to-now.pipe.js";
import { CustomFormatDistancePipe } from "./pipes/custom-format-distance.pipe.js";
import { SafePipe } from "./pipes/safe.pipe.js";

const DIRECTIVES = [HighlightOnChangeDirective];
const PIPES = [CustomFormatDistancePipe, CustomFormatDistanceToNowPipe, SafePipe];
const COMPONENTS = [IconComponent];
// const THIRDPARTYMODULES = [];

@NgModule({
    declarations: [...COMPONENTS, ...PIPES, ...DIRECTIVES],
    imports: [BrowserAnimationsModule, CommonModule],
    exports: [...COMPONENTS, ...PIPES, ...DIRECTIVES, CommonModule],
})
export class SharedModule {}
