import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { UIContainerComponent } from "./components/ui-container/ui-container.component";
import { HighlightOnChangeDirective } from "./directives/highlight-on-change.directive";
import { ResizeDirective } from "./directives/resize.directive";

const DIRECTIVES = [HighlightOnChangeDirective, ResizeDirective];
const PIPES: any[] = [];
const COMPONENTS = [UIContainerComponent];

@NgModule({
    declarations: [...DIRECTIVES, ...PIPES, ...COMPONENTS],
    imports: [CommonModule],
    exports: [CommonModule, ...DIRECTIVES, ...PIPES, ...COMPONENTS],
})
export class SharedModule {}
