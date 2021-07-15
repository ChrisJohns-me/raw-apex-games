import { AfterViewChecked, AfterViewInit, Directive, ElementRef, HostListener, Inject, Input, OnChanges } from "@angular/core";
import { WINDOW } from "@shared-app/services/window.service";

/**
 * Dynamically sets the height of an element to reach the bottom of the window
 * Also listens to Window's Resize events
 */
@Directive({ selector: "[appFullHeight]" })
export class FullHeightDirective implements AfterViewInit, AfterViewChecked, OnChanges {
    @Input() public marginBottom = 0;
    @Input() public overflowY: "auto" | "hidden" | "scroll" | "unset" | "inherit" = "auto";

    constructor(private readonly elementRef: ElementRef<HTMLElement>, @Inject(WINDOW) private readonly window: Window) {}

    public ngAfterViewInit(): void {
        this.setFullHeight();
    }

    public ngOnChanges(): void {
        this.setFullHeight();
    }

    public ngAfterViewChecked(): void {
        this.setFullHeight();
    }

    @HostListener("window:resize")
    public onResize(): void {
        this.setFullHeight();
    }

    private setFullHeight(): void {
        const elementTop = this.elementRef?.nativeElement?.offsetTop ?? 0;
        const windowHeight = this.window.innerHeight ?? this.window.outerHeight ?? 0;
        const height = windowHeight - elementTop - this.marginBottom;
        if (height <= 0) return;

        this.elementRef.nativeElement.style.height = `${height}px`;
        this.elementRef.nativeElement.style.overflowY = this.overflowY;
    }
}
