import { FullHeightDirective } from "@allfather-app/app/shared/directives/full-height.directive";
import { Directive, Input } from "@angular/core";

@Directive({ selector: "[appFullHeight]" })
export class MockFullHeightDirective implements MockedClass<FullHeightDirective> {
    @Input() public marginBottom = 0;
    @Input() public overflowY: "auto" | "hidden" | "scroll" | "unset" | "inherit" = "auto";
}
