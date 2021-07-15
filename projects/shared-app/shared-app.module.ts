import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { IconComponent } from "@shared/components/icon/icon.component";
import { RankIconComponent } from "@shared/components/rank-icon/rank-icon.component";
import { HighlightOnChangeDirective } from "@shared/directives/highlight-on-change.directive";
import { CustomFormatDistanceToNowPipe } from "@shared/pipes/custom-format-distance-to-now.pipe";
import { CustomFormatDistancePipe } from "@shared/pipes/custom-format-distance.pipe";
import { SafePipe } from "@shared/pipes/safe.pipe";
import { DateFnsModule } from "ngx-date-fns";
import { FullHeightDirective } from "./directives/full-height.directive";
import { HrefDirective } from "./directives/href.directive";

const DIRECTIVES = [HighlightOnChangeDirective, HrefDirective, FullHeightDirective];
const PIPES = [CustomFormatDistancePipe, CustomFormatDistanceToNowPipe, SafePipe];
const COMPONENTS = [RankIconComponent, IconComponent];
const THIRDPARTYMODULES = [DateFnsModule];

/**
 * @class SharedModule
 * @classdesc Used for desktop-like window components.
 *  No declarations should be placed directly in this class.
 */
@NgModule({
    declarations: [...DIRECTIVES, ...PIPES, ...COMPONENTS],
    imports: [...THIRDPARTYMODULES, BrowserAnimationsModule, CommonModule],
    exports: [...THIRDPARTYMODULES, ...DIRECTIVES, ...PIPES, ...COMPONENTS, CommonModule],
})
export class SharedAppModule {}
