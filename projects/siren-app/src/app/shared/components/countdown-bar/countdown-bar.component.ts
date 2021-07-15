import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild,
} from "@angular/core";
import { interval, Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";

const UI_REFRESH_RATE = 1000;

/**
 * Shows a countdown bar (reverse progress bar).
 * Remember to set the height of the parent element.
 */
@Component({
    selector: "app-countdown-bar",
    templateUrl: "./countdown-bar.component.html",
    styleUrls: ["./countdown-bar.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountdownBarComponent implements OnInit, OnChanges, OnDestroy {
    @Input() public endDate?: Date;
    @Input() public pause = false;
    @Input() public color = "#71180e";

    @ViewChild("progressBar") private progressBarRef?: ElementRef;

    private startDate = new Date();
    private timerSubscription?: Subscription;
    private lastPercent = 1;
    private destroy$ = new Subject<void>();

    constructor(private cdr: ChangeDetectorRef) {}

    public ngOnInit(): void {
        this.resetTimer();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.endDate) {
            this.resetTimer();
        }

        if (changes.pause) {
            if (this.pause) this.timerSubscription?.unsubscribe();
            else this.resetTimer();
        }
    }

    public checkPercentage(): number {
        if (!this.endDate) return 1;
        if (this.pause) return this.lastPercent;
        const duration = this.endDate.getTime() - this.startDate.getTime() - UI_REFRESH_RATE;
        const remaining = this.endDate.getTime() - new Date().getTime() - UI_REFRESH_RATE;
        const percent = Math.max(0, remaining / duration);

        if (percent <= 0) this.timerSubscription?.unsubscribe();
        this.lastPercent = percent;
        return percent;
    }

    private resetTimer(): void {
        this.startDate = new Date();
        if (this.pause) return;
        this.timerSubscription = interval(UI_REFRESH_RATE)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.cdr.detectChanges());
    }
}
