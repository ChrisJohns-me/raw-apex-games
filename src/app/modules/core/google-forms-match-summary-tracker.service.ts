import { HttpClient } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { Legend } from "@common/legend";
import { MatchGameMode } from "@common/match/match-game-mode";
import { MatchMap } from "@common/match/match-map";
import { MatchStateChangedEvent } from "@common/match/match-state";
import { MatchSummary } from "@common/match/match-summary";
import { combineLatest, Observable, of, ReplaySubject, Subject } from "rxjs";
import { catchError, delay, filter, map, retryWhen, switchMap, take, takeUntil, tap } from "rxjs/operators";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { Config } from "src/config";
import { MatchMapService } from "./match/match-map.service";
import { MatchPlayerLegendService } from "./match/match-player-legend.service";
import { MatchPlayerStatsService } from "./match/match-player-stats.service";
import { MatchService } from "./match/match.service";

const RETRY_DELAY = 10000;
const MAX_RETRIES = 3;

@Injectable({
    providedIn: "root",
    deps: [HttpClient, MatchService, MatchMapService, MatchPlayerLegendService, MatchPlayerStatsService],
    useFactory: (...deps: unknown[]) =>
        SingletonServiceProviderFactory("GoogleFormsMatchSummaryTrackerService", GoogleFormsMatchSummaryTrackerService, deps),
})
export class GoogleFormsMatchSummaryTrackerService implements OnDestroy {
    public lastMatchSummary = new ReplaySubject<MatchSummary>(1);
    public get isTrackingEnabled(): boolean {
        return this._isTrackingEnabled;
    }

    private unreportedMatchSummary?: MatchSummary;
    private _isTrackingEnabled = false;

    private readonly _unsubscribe = new Subject<void>();

    constructor(
        private readonly httpClient: HttpClient,
        private readonly match: MatchService,
        private readonly matchMap: MatchMapService,
        private readonly matchPlayerLegend: MatchPlayerLegendService,
        private readonly matchPlayerStats: MatchPlayerStatsService
    ) {}

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public start(): void {
        this.setupTracking();
    }

    public setTrackingEnabled(enabled: boolean): void {
        this._isTrackingEnabled = enabled;
    }

    public reportMatchSummaryToGoogleForms(matchSummary: MatchSummary): Observable<{ success: boolean; error?: unknown }> {
        const url = Config.googleFormUrl;

        const params = {
            "entry.894638192": matchSummary.legend?.friendlyName ?? "",
            "entry.424316428": matchSummary.map?.friendlyName ?? "",
            "entry.606820101": matchSummary.gameMode?.friendlyName ?? "",
            "entry.2001849655": String(matchSummary.placement ?? ""),
            "entry.1889749617": String(matchSummary.damage ?? ""),
            "entry.1895879894": String(matchSummary.eliminations ?? ""),
        };

        return this.httpClient
            .get(url, { params, observe: "response", responseType: "text" })
            .pipe(
                takeUntil(this._unsubscribe),
                map((response) => ({
                    success: response.ok,
                    error: !response.ok ? response.statusText : undefined,
                })),
                retryWhen((errors) => errors.pipe(delay(RETRY_DELAY), take(MAX_RETRIES))),
                catchError((err) => of({ success: false, error: err?.message }))
            )
            .pipe(tap(() => this.lastMatchSummary.next()));
    }

    private setupTracking(): void {
        let isTracking = false;
        let isReportTriggered = false;

        this.match.endedEvent$
            .pipe(
                takeUntil(this._unsubscribe),
                switchMap(() =>
                    combineLatest<[Legend, MatchMap, MatchGameMode, number, number, number, MatchStateChangedEvent]>([
                        this.matchPlayerLegend.myLegend$,
                        this.matchMap.map$,
                        this.match.gameMode$,
                        this.matchPlayerStats.myPlacement$,
                        this.matchPlayerStats.myEliminations,
                        this.matchPlayerStats.myDamage$,
                        this.match.state$,
                    ])
                ),
                filter(() => {
                    const isTrackingEnabled = this.isTrackingEnabled;
                    if (!isTrackingEnabled && (isTracking || isReportTriggered)) {
                        isTracking = isReportTriggered = false;
                        delete this.unreportedMatchSummary;
                    }
                    return isTrackingEnabled;
                }),
                tap(([legend, gameMap, gameMode, placement, eliminations, damage, matchState]) => {
                    const matchDurationMs =
                        !!matchState.endDate && !!matchState.startDate
                            ? matchState.endDate?.getTime() - matchState.startDate?.getTime()
                            : undefined;
                    this.unreportedMatchSummary = {
                        eliminations: eliminations,
                        legend: legend,
                        damage: damage,
                        map: gameMap,
                        placement: placement,
                        gameMode: gameMode ?? undefined,
                        durationMs: matchDurationMs,
                    };
                }),
                filter(() => isTracking && isReportTriggered),
                switchMap(() => this.reportMatchSummary(this.unreportedMatchSummary))
            )
            .subscribe((result) => {
                console.debug("Match Summary Tracked:", result.success);
                delete this.unreportedMatchSummary;
            });
    }

    private reportMatchSummary(summary?: MatchSummary): Observable<{ success: boolean }> {
        if (!this.isTrackingEnabled) return of();
        if (!summary || !summary.legend || (summary.placement ?? 0) <= 0)
            return of({ success: false, error: new Error("Missing Match Summary when attempting to track.") });

        return this.reportMatchSummaryToGoogleForms(summary).pipe(
            tap((response) => {
                if (response.success) {
                    this.lastMatchSummary.next(summary);
                } else {
                    alert("Tried to track match summary, got an error:\n" + response.error);
                }
            })
        );
    }
}
