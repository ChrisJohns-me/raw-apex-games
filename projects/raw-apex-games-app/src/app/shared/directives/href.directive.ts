import { Directive, HostListener, Input } from "@angular/core";

@Directive({
    selector: "[href]",
})
export class HrefDirective {
    @Input() public href?: string;

    @HostListener("click", ["$event"]) public onClick(event: Event): void {
        if (!this.href || this.href === "#" || (this.href && this.href.length === 0)) {
            event.preventDefault();
        }
    }
}
