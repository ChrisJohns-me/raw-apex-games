import { AfterViewInit, Directive, ElementRef, HostListener, Input } from "@angular/core";

// <div appHighlightOnChange>{{ textVariableStr }}</div>
// <div appHighlightOnChange></div>
@Directive({
    selector: "[appHighlightOnChange]",
})
export class HighlightOnChangeDirective implements AfterViewInit {
    @Input() public highlightColor = "yellow";
    @Input() public highlightDuration = 1000;

    private isHighlighting = false;
    private highlightTransitionMs = 250;
    private get highlightTransitionMsStr(): string {
        return this.highlightTransitionMs + "ms";
    }
    private previousBackgroundColor = "";
    private previousTransition = "";
    private oldValue?: string;
    constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

    public ngAfterViewInit(): void {
        this.oldValue = this.innerText;
    }

    @HostListener("DOMCharacterDataModified")
    public onDataModified(): void {
        if (this.oldValue !== this.innerText) this.onChanged();
        this.oldValue = this.innerText;
    }

    private onChanged(): void {
        this.addHighlight();
        setTimeout(() => this.removeHighlight(), this.highlightDuration);
    }

    private addHighlight(): void {
        if (this.isHighlighting) return;
        this.isHighlighting = true;
        this.previousTransition = this.transition;
        this.previousBackgroundColor = this.backgroundColor;

        this.transition = this.highlightTransitionMsStr;
        setTimeout(() => {
            if (!this.isHighlighting) return;
            this.backgroundColor = this.highlightColor;
        });
    }

    private removeHighlight(): void {
        if (!this.isHighlighting) return;
        this.backgroundColor = this.previousBackgroundColor ? this.previousBackgroundColor : "transparent";
        setTimeout(() => {
            if (!this.isHighlighting) return;
            this.transition = this.previousTransition;
            this.backgroundColor = this.previousBackgroundColor;
            this.previousBackgroundColor = "";
            this.previousTransition = "";
            this.isHighlighting = false;
        }, this.highlightTransitionMs);
    }

    private get innerText(): string {
        return this.elementRef.nativeElement.innerText;
    }

    private get backgroundColor(): string {
        return this.elementRef.nativeElement.style.backgroundColor;
    }

    private set backgroundColor(bgColor: string) {
        this.elementRef.nativeElement.style.backgroundColor = bgColor;
    }

    private get transition(): string {
        return this.elementRef.nativeElement.style.transition;
    }

    private set transition(transition: string) {
        this.elementRef.nativeElement.style.transition = transition;
    }
}
