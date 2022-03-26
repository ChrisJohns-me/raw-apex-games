import { MapRotationService } from "@allfather-app/app/modules/core/map-rotation/map-rotation.service";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { MapRotationData } from "@shared-app/match/map/map-rotation-data";
import { MatchMap } from "@shared-app/match/map/match-map";
import { isFuture, isPast } from "date-fns";
import addMinutes from "date-fns/addMinutes";
import { interval, Subject } from "rxjs";
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

    constructor(private readonly cdr: ChangeDetectorRef, private readonly mapRotation: MapRotationService) {}

    public forceTemplateDateRefresh = (input: Date): Date => new Date(input);
    public getMapImageName = MatchMap.getPreviewFilename;
    public isFuture = isFuture;
    public isPast = isPast;

    public ngOnInit(): void {
        this.setupMapRotation();
        this.setupUIRefreshTimer();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Checks once a minute to see if the map rotation data needs to be updated.
     */
    private setupMapRotation(): void {
        this.mapRotation.mapRotation$.pipe(takeUntil(this.destroy$)).subscribe((rotationData) => {
            this.mapRotationData = rotationData;
            this.fastUIRefresh = true; // Temporarily turn on fast refreshing after data is fetched
        });
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
