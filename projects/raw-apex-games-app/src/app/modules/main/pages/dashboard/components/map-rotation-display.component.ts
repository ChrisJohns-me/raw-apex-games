import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { MapRotationData } from "@raw-apex-games-app/app/common/match/map/map-rotation-data";
import { MatchMap } from "@raw-apex-games-app/app/common/match/map/match-map";
import { isFuture, isPast } from "date-fns";
import addMinutes from "date-fns/addMinutes";
import { Subject, interval } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";

@Component({
    selector: "app-map-rotation-display",
    templateUrl: "./map-rotation-display.component.html",
    styleUrls: ["./map-rotation-display.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapRotationDisplayComponent implements OnInit, OnDestroy {
    public mapRotationData?: MapRotationData;

    /** Enables change detection to run every second; otherwise every minute */
    private fastUIRefresh = true;

    private destroy$ = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef) {}

    public forceTemplateDateRefresh = (input: Date): Date => new Date(input);
    public getMapImageName = MatchMap.getPreviewFilename;
    public isFuture = isFuture;
    public isPast = isPast;

    public ngOnInit(): void {
        this.setupUIRefreshTimer();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private setupUIRefreshTimer(): void {
        const slowRefreshInterval = 60; // seconds
        interval(1000)
            .pipe(
                takeUntil(this.destroy$),
                filter((i) => this.fastUIRefresh || i % slowRefreshInterval === 0)
            )
            .subscribe(() => {
                if (!this.mapRotationData) {
                    this.fastUIRefresh = true;
                } else {
                    const soonestMapInfo = MapRotationData.getSoonestMapRotationInfo(this.mapRotationData);
                    this.fastUIRefresh = (soonestMapInfo?.endDate ?? 0) < addMinutes(new Date(), 2);
                }
                this.cdr.detectChanges();
            });
    }
}
