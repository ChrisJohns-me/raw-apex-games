import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { WindowComponent } from "./components/window/window.component";
import { ResizeDirective } from "./directives/resize.directive";

const DIRECTIVES = [ResizeDirective];
const PIPES: any[] = [];
const COMPONENTS = [WindowComponent];

@NgModule({
    declarations: [...DIRECTIVES, ...PIPES, ...COMPONENTS],
    imports: [CommonModule],
    exports: [CommonModule, ...DIRECTIVES, ...PIPES, ...COMPONENTS],
})
export class SharedModule {}
