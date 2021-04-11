import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BootstrapCSSInjectorComponent } from "./components/ui-container/bootstrap-css-injector/bootstrap-css-injector.component";
import { UIContainerComponent } from "./components/ui-container/ui-container.component";
import { HighlightOnChangeDirective } from "./directives/highlight-on-change.directive";
import { ResizeDirective } from "./directives/resize.directive";
import { CustomFormatDistanceToNowPipe } from "./pipes/custom-format-distance-to-now.pipe";
import { CustomFormatDistancePipe } from "./pipes/custom-format-distance.pipe";
import { FormatDistanceStrictPipe } from "./pipes/format-distance-strict.pipe";
import { FormatDistanceToNowStrictPipe } from "./pipes/format-distance-to-now-strict.pipe";
import { FormatDistanceToNowPipe } from "./pipes/format-distance-to-now.pipe";
import { FormatDistancePipe } from "./pipes/format-distance.pipe";

const DIRECTIVES = [HighlightOnChangeDirective, ResizeDirective];
const PIPES = [
    CustomFormatDistancePipe,
    CustomFormatDistanceToNowPipe,
    FormatDistancePipe,
    FormatDistanceStrictPipe,
    FormatDistanceToNowPipe,
    FormatDistanceToNowStrictPipe,
];
const COMPONENTS = [BootstrapCSSInjectorComponent, UIContainerComponent];

@NgModule({
    declarations: [...DIRECTIVES, ...PIPES, ...COMPONENTS],
    imports: [CommonModule],
    exports: [CommonModule, ...DIRECTIVES, ...PIPES, ...COMPONENTS],
})
export class SharedModule {}
