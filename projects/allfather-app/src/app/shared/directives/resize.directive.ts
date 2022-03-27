import { UIWindow } from "@allfather-app/app/modules/core/_refactor/ui-window";
import { Directive, ElementRef, NgZone, OnDestroy, OnInit } from "@angular/core";

// TODO: Not sure if this is needed.
// Need to see if this helps with changing the Overwolf's window height.
@Directive({
    selector: "[appResize]",
})
export class ResizeDirective implements OnInit, OnDestroy {
    private observer!: ResizeObserver;

    constructor(private readonly elementRef: ElementRef<HTMLElement>, private readonly ngZone: NgZone) {}

    public ngOnInit(): void {
        const window = new UIWindow();
        window.assureObtained().subscribe(() => {
            this.observer = new ResizeObserver(() => {
                this.ngZone.run(() => {
                    const { offsetWidth, offsetHeight } = this.elementRef.nativeElement;
                    window.changeSize(offsetWidth, offsetHeight).subscribe();
                });
            });
            this.observer.observe(this.elementRef.nativeElement);
        });
    }

    public ngOnDestroy(): void {
        this.observer?.unobserve(this.elementRef.nativeElement);
        this.observer?.disconnect();
    }
}
