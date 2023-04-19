import { AfterViewChecked, AfterViewInit, Directive, ElementRef, Inject, Input, OnChanges, OnDestroy } from "@angular/core";
import { Subject, fromEvent, takeUntil } from "rxjs";
import { WINDOW } from "../../modules/core/global-window.provider";

/**
 * Dynamically sets the height of an element to reach the bottom of the window
 * Also listens to Window's Resize events
 */
@Directive({ selector: "[appFullHeight]" })
export class FullHeightDirective implements AfterViewInit, OnChanges, AfterViewChecked, OnDestroy {
    @Input() public marginBottom = 0;
    @Input() public overflowY: "auto" | "hidden" | "scroll" | "unset" | "inherit" = "auto";

    private destroy$ = new Subject<void>();

    constructor(private readonly elementRef: ElementRef<HTMLElement>, @Inject(WINDOW) private readonly window: Window) {}

    public ngAfterViewInit(): void {
        this.setFullHeight();
        this.setResizeEventListener();
    }

    public ngOnChanges(): void {
        this.setFullHeight();
    }

    public ngAfterViewChecked(): void {
        this.setFullHeight();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private setResizeEventListener(): void {
        fromEvent(this.window, "resize")
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.onResize());
    }

    private onResize(): void {
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
