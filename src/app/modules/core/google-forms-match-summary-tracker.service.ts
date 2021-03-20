import { HttpClient } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { MatchSummary } from "@common/match-summary";
import { combineLatest, Observable, of, ReplaySubject, Subject } from "rxjs";
import { catchError, delay, filter, map, retryWhen, switchMap, take, takeUntil, tap } from "rxjs/operators";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { Config } from "src/config";
import { MatchMapService } from "./match-map.service";
import { MatchService } from "./match.service";
import { PlayerActivityService } from "./player-activity.service";
import { PlayerLegendService } from "./player-legend.service";

const RETRY_DELAY = 10000;
const MAX_RETRIES = 3;

@Injectable({
    providedIn: "root",
    deps: [HttpClient, MatchService, MatchMapService, PlayerActivityService, PlayerLegendService],
    useFactory: (...deps: unknown[]) =>
        SingletonServiceProviderFactory(
            "GoogleFormsMatchSummaryTrackerService",
            GoogleFormsMatchSummaryTrackerService,
            deps
        ),
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
        private readonly playerActivity: PlayerActivityService,
        private readonly playerLegend: PlayerLegendService
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

    public reportMatchSummaryToGoogleForms(
        matchSummary: MatchSummary
    ): Observable<{ success: boolean; error?: unknown }> {
        const url = Config.googleFormUrl;

        const params = {
            "entry.894638192": matchSummary.legend?.friendlyName ?? "",
            "entry.424316428": matchSummary.map?.friendlyName ?? "",
            "entry.606820101": matchSummary.gameMode?.friendlyName ?? "",
            "entry.2001849655": String(matchSummary.placement ?? ""),
            "entry.1889749617": String(matchSummary.damage ?? ""),
            "entry.1895879894": String(matchSummary.kills ?? ""),
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

        this.match.ended$
            .pipe(
                takeUntil(this._unsubscribe),
                switchMap(() =>
                    combineLatest([
                        this.playerLegend.legend$,
                        this.matchMap.map$,
                        this.match.gameMode$,
                        this.playerActivity.placement$,
                        this.playerActivity.damageRoster$,
                        this.match.currentState$,
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
                tap(([legend, gameMap, gameMode, placement, damageRoster, matchTime]) => {
                    const matchDurationMs =
                        !!matchTime.endDate && !!matchTime.startDate
                            ? matchTime.endDate?.getTime() - matchTime.startDate?.getTime()
                            : undefined;
                    this.unreportedMatchSummary = {
                        kills: damageRoster.activePlayerEliminationsInflictedSum,
                        legend: legend,
                        damage: damageRoster.activePlayerDamageInflictedSum,
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
