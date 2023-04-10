import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnDestroy, Output } from "@angular/core";
import { delay, of, Subject, takeUntil } from "rxjs";

const REFRESH_DELAY = 5000;

@Component({
    selector: "app-first-run-page",
    styleUrls: ["./first-run-page.component.scss"],
    templateUrl: "./first-run-page.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FirstRunPageComponent implements AfterViewInit, OnDestroy {
    @Output() public finishButtonClick = new EventEmitter<void>();

    private destroy$ = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef) {}

    public ngAfterViewInit(): void {
        of(null)
            .pipe(takeUntil(this.destroy$), delay(REFRESH_DELAY))
            .subscribe(() => this.cdr.detectChanges());
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
