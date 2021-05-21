import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DateFnsModule } from "ngx-date-fns";
import { ComplimentaryLegendsComponent } from "./components/complimentary-legends/complimentary-legends.component";
import { IconComponent } from "./components/icon/icon.component";
import { MatchListingComponent } from "./components/match-listing/match-listing.component";
import { BootstrapCSSInjectorComponent } from "./components/ui-container/bootstrap-css-injector/bootstrap-css-injector.component";
import { UIContainerComponent } from "./components/ui-container/ui-container.component";
import { HighlightOnChangeDirective } from "./directives/highlight-on-change.directive";
import { HrefDirective } from "./directives/href.directive";
import { ResizeDirective } from "./directives/resize.directive";
import { CustomFormatDistanceToNowPipe } from "./pipes/custom-format-distance-to-now.pipe";
import { CustomFormatDistancePipe } from "./pipes/custom-format-distance.pipe";

const DIRECTIVES = [HighlightOnChangeDirective, HrefDirective, ResizeDirective];
const PIPES = [CustomFormatDistancePipe, CustomFormatDistanceToNowPipe];
const COMPONENTS = [
    BootstrapCSSInjectorComponent,
    ComplimentaryLegendsComponent,
    MatchListingComponent,
    IconComponent,
    UIContainerComponent,
];
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
export class SharedModule {}
