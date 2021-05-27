import { findSoonestMapRotationInfo, MapRotation } from "@allfather-app/app/common/match/map/map-rotation";
import { MatchMap } from "@allfather-app/app/common/match/map/match-map";
import { MatchMapService } from "@allfather-app/app/modules/core/match/match-map.service";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { differenceInMilliseconds, isFuture, isPast } from "date-fns";
import addMinutes from "date-fns/addMinutes";
import { BehaviorSubject, EMPTY, interval, of, Subject, timer } from "rxjs";
import { expand, filter, switchMap, takeUntil, tap } from "rxjs/operators";

@Component({
    selector: "app-map-rotation-display",
    templateUrl: "./map-rotation-display.component.html",
    styleUrls: ["./map-rotation-display.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapRotationDisplayComponent implements OnInit, OnDestroy {
    public mapRotation?: MapRotation;

    /** Enables change detection to run every second; otherwise every minute */
    private fastUIRefresh = true;
    /** Timer to fetch map rotation */
    private mapRotationFetchTimer$ = new BehaviorSubject<number>(0);

    private destroy$ = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef, private readonly matchMap: MatchMapService) {}

    public forceTemplateDateRefresh = (input: Date): Date => new Date(input);
    public getMapImageName = MatchMap.getPreviewFilename;
    public isFuture = isFuture;
    public isPast = isPast;

    public ngOnInit(): void {
        this.setupMapRotationCheck();
        this.setupUIRefreshTimer();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private setupMapRotationCheck(): void {
        const addedFetchDelay = 10 * 1000;

        const handleDataFn = (mapRotation: MapRotation) => {
            this.mapRotation = mapRotation;
            this.fastUIRefresh = true; // Temporarily turn on fast refreshing after data is fetched
            const soonestMapInfo = findSoonestMapRotationInfo(mapRotation);
            const newDelay = soonestMapInfo?.endDate
                ? differenceInMilliseconds(soonestMapInfo.endDate, new Date()) + addedFetchDelay
                : 10 * 60 * 1000;
            console.debug(
                `[${this.constructor.name}] Checking map rotation in ${Math.round(newDelay / 1000)} seconds; ` +
                    `soonest map change "${soonestMapInfo?.friendlyName}" at ${soonestMapInfo?.startDate}`
            );
            this.mapRotationFetchTimer$.next(newDelay);
        };

        const loopOperator = (timeMs: number) =>
            expand(() =>
                timer(timeMs).pipe(
                    switchMap(() => this.matchMap.getMapRotation$()),
                    tap((mapRotation) => handleDataFn(mapRotation))
                )
            );

        this.mapRotationFetchTimer$
            .pipe(
                takeUntil(this.destroy$),
                switchMap((delayTimeMs) => (delayTimeMs < 0 ? EMPTY : of("start").pipe(loopOperator(delayTimeMs))))
            )
            .subscribe();
    }

    private setupUIRefreshTimer(): void {
        const slowRefreshInterval = 60; // seconds
        interval(1000)
            .pipe(
                takeUntil(this.destroy$),
                filter((i) => this.fastUIRefresh || i % slowRefreshInterval === 0)
            )
            .subscribe(() => {
                if (!this.mapRotation) {
                    this.fastUIRefresh = true;
                } else {
                    const soonestMapInfo = findSoonestMapRotationInfo(this.mapRotation);
                    this.fastUIRefresh = (soonestMapInfo?.endDate ?? 0) < addMinutes(new Date(), 2);
                }
                this.cdr.detectChanges();
            });
    }
}
