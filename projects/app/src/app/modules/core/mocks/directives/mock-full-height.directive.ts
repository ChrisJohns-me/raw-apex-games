import { Directive, Input } from "@angular/core";
import { FullHeightDirective } from "../../../../shared/directives/full-height.directive";

@Directive({ selector: "[appFullHeight]" })
export class MockFullHeightDirective implements MockedClass<FullHeightDirective> {
    @Input() public marginBottom = 0;
    @Input() public overflowY: "auto" | "hidden" | "scroll" | "unset" | "inherit" = "auto";
}
