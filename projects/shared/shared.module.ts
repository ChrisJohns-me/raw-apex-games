import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DateFnsModule } from "ngx-date-fns";
import { IconComponent } from "./components/icon/icon.component";
import { HighlightOnChangeDirective } from "./directives/highlight-on-change.directive";
import { CustomFormatDistanceToNowPipe } from "./pipes/custom-format-distance-to-now.pipe";
import { CustomFormatDistancePipe } from "./pipes/custom-format-distance.pipe";
import { SafePipe } from "./pipes/safe.pipe";

const DIRECTIVES = [HighlightOnChangeDirective];
const PIPES = [CustomFormatDistancePipe, CustomFormatDistanceToNowPipe, SafePipe];
const COMPONENTS = [IconComponent];
// const THIRDPARTYMODULES = [];

@NgModule({
    declarations: [...COMPONENTS, ...PIPES, ...DIRECTIVES],
    imports: [BrowserAnimationsModule, CommonModule, DateFnsModule],
    exports: [...COMPONENTS, ...PIPES, ...DIRECTIVES, CommonModule],
})
export class SharedModule {}
