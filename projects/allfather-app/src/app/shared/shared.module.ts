import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DateFnsModule } from "ngx-date-fns";
import { MatchListingComponent } from "./components/match-listing.component";
import { BootstrapCSSInjectorComponent } from "./components/ui-container/bootstrap-css-injector/bootstrap-css-injector.component";
import { UIContainerComponent } from "./components/ui-container/ui-container.component";
import { HighlightOnChangeDirective } from "./directives/highlight-on-change.directive";
import { HrefDirective } from "./directives/href";
import { ResizeDirective } from "./directives/resize.directive";
import { CustomFormatDistanceToNowPipe } from "./pipes/custom-format-distance-to-now.pipe";
import { CustomFormatDistancePipe } from "./pipes/custom-format-distance.pipe";

const DIRECTIVES = [HighlightOnChangeDirective, HrefDirective, ResizeDirective];
const PIPES = [CustomFormatDistancePipe, CustomFormatDistanceToNowPipe];
const COMPONENTS = [BootstrapCSSInjectorComponent, MatchListingComponent, UIContainerComponent];
const THIRDPARTYMODULES = [DateFnsModule];

@NgModule({
    declarations: [...DIRECTIVES, ...PIPES, ...COMPONENTS],
    imports: [...THIRDPARTYMODULES, CommonModule],
    exports: [...THIRDPARTYMODULES, ...DIRECTIVES, ...PIPES, ...COMPONENTS, CommonModule],
})
export class SharedModule {}
