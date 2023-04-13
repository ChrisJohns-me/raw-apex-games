import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Advertisement } from "@raw-apex-games-app/app/common/advertisement";
import { MatchMapCoordinates } from "@raw-apex-games-app/app/common/match/map/map-coordinates";
import { MatchMapList } from "@raw-apex-games-app/app/common/match/map/map-list";
import { MatchMap } from "@raw-apex-games-app/app/common/match/map/match-map";
import { OverwolfWindowName } from "@raw-apex-games-app/app/common/overwolf-window";
import { INGAME_UNITS_PER_METER, coordinatesDistance } from "@raw-apex-games-app/app/common/utilities/coordinates-distance";
import { slideInLeftAnimation } from "@shared/animations/slide-in-left.animation";
import { isEmpty } from "common/utilities";
import { addMilliseconds, isDate } from "date-fns";
import { OperatorFunction, Subject, filter, takeUntil, tap } from "rxjs";
import { ConfigurationService } from "../../core/configuration.service";
import { WINDOW } from "../../core/global-window.provider";
import { LocationPhaseNum, MatchDataStore } from "../../core/local-database/match-data-store";
import { MatchService } from "../../core/match/match.service";
import { InGameWindowService } from "../../in-game/windows/in-game-window.service";

const LATEST_MATCH_MS = 1000 * 60;

@Component({
    selector: "app-match-summary-window",
    templateUrl: "./match-summary-window.component.html",
    styleUrls: ["./match-summary-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [slideInLeftAnimation],
})
export class MatchSummaryWindowComponent implements OnInit, OnDestroy {
    /** isVIP */
    public aXNWSVA = false;
    public isVisible = false;
    public showAd = false;
    public latestMatch?: MatchDataStore;
    public latestMatchMap?: MatchMap;
    public travelCoordinatesList: MatchMapCoordinates[] = [];
    public eliminationCoordinatesList: MatchMapCoordinates[] = [];
    public distanceTraveled? = 0;
    public videoAd!: Advertisement;
    public readonly OverwolfWindowName = OverwolfWindowName;

    @ViewChild("videoAd") private videoAdElement!: ElementRef;
    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly configuration: ConfigurationService,
        private readonly inGameWindow: InGameWindowService,
        private readonly match: MatchService,
        @Inject(WINDOW) private readonly window: Window
    ) {}

    public ngOnInit(): void {
        this.prepareAdvertisement();
        this.checkLatestMatch();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onTravelHeatmapClick(): void {
        // this.inGameWindow.focus(MainPage.MapExplorer).pipe(takeUntil(this.destroy$)).subscribe();
    }

    public onEliminationHeatmapClick(): void {
        // this.inGameWindow.focus(MainPage.MapExplorer).pipe(takeUntil(this.destroy$)).subscribe();
    }

    public onDismissClick(): void {
        this.isVisible = false;
        this.refreshUI();
    }

    private checkLatestMatch(): void {
        this.match
            .getLatestMatchData$()
            .pipe(
                takeUntil(this.destroy$),
                filter((latestMatch) => !isEmpty(latestMatch) && isDate(latestMatch!.endDate)) as OperatorFunction<
                    Optional<MatchDataStore>,
                    MatchDataStore
                >,
                filter((latestMatch) => new Date() < addMilliseconds(latestMatch.endDate!, LATEST_MATCH_MS)),
                tap((latestMatch) => {
                    this.latestMatch = latestMatch;
                    this.latestMatchMap = this.getLatestMapFromMapId(this.latestMatch.mapId);
                    this.travelCoordinatesList = this.getTravelCoordinatesList(this.latestMatch.locationHistory);
                    this.eliminationCoordinatesList = this.getEliminationCoordinatesList(this.latestMatch.eliminationLocationHistory);
                    this.distanceTraveled = this.getDistanceTraveled(this.latestMatch.locationHistory);
                })
                // switchMap(() => ),
            )
            .subscribe(() => {
                this.isVisible = true;
                this.prepareAdvertisement();
                this.refreshUI();
            });
    }

    //#region Match Calculation Methods
    private getLatestMapFromMapId(mapId?: string): Optional<MatchMap> {
        if (isEmpty(mapId)) return;
        return MatchMap.getFromId(mapId!, MatchMapList);
    }

    private getTravelCoordinatesList(locationHistory: MatchDataStore["locationHistory"]): MatchMapCoordinates[] {
        if (isEmpty(locationHistory)) return [];
        return locationHistory!
            .filter((location) => location.value.phaseNum === LocationPhaseNum.HasLanded)
            .map((location) => location.value);
    }

    private getEliminationCoordinatesList(eliminationHistory: MatchDataStore["eliminationLocationHistory"]): MatchMapCoordinates[] {
        if (isEmpty(eliminationHistory)) return [];
        return eliminationHistory!.map((location) => location.value);
    }

    private getDistanceTraveled(locationHistory: MatchDataStore["locationHistory"]): Optional<number> {
        if (isEmpty(locationHistory)) return;
        const travelCoordinatesList = this.getTravelCoordinatesList(locationHistory);
        const distanceInUnits = coordinatesDistance(travelCoordinatesList, true);
        const distanceInMeters = distanceInUnits * INGAME_UNITS_PER_METER;
        return distanceInMeters;
    }
    //#endregion

    //#region Ad Methods
    private prepareAdvertisement(): void {
        // this.videoAd = new Advertisement({
        //     adHTMLElement: this.videoAdElement?.nativeElement,
        //     overwolfWindowName: OverwolfWindowName.MatchSummary,
        //     overwolfWindowStateChangedEvent: this.overwolfWindow.state.stateChange$,
        //     windowObj: this.window,
        // });

        this.configuration.config$.pipe(takeUntil(this.destroy$)).subscribe((config) => {
            this.showAd = config.general.enableMatchSummaryAd;
        });
    }
    //#endregion

    private refreshUI(): void {
        this.cdr.detectChanges();
    }
}
