import { HttpClient } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { getFriendlyGameMode } from "@common/game-mode";
import { getFriendlyLegendName } from "@common/legend";
import { Observable, of, ReplaySubject, Subject } from "rxjs";
import { catchError, delay, map, retryWhen, take, takeUntil } from "rxjs/operators";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { Config } from "src/config";
import { MatchSummary } from "./background.component";

const RETRY_DELAY = 10000;
const MAX_RETRIES = 3;

@Injectable({
    providedIn: "root",
    deps: [HttpClient],
    useFactory: (...deps: any[]) => SingletonServiceProviderFactory("BackgroundService", BackgroundService, deps),
})
export class BackgroundService implements OnDestroy {
    public lastMatchSummary: Observable<MatchSummary>;
    public get isTrackingEnabled(): boolean {
        return this._isTrackingEnabled;
    }

    private _isTrackingEnabled = false;

    private readonly _lastMatchSummary = new ReplaySubject<MatchSummary>(1);
    private readonly _unsubscribe = new Subject<void>();

    private tempIdentifier = String(Math.floor(Math.random() * 10000000));
    constructor(private readonly httpClient: HttpClient) {
        console.debug(`[${this.constructor.name}:${this.tempIdentifier}] instantiated`);

        this.lastMatchSummary = this._lastMatchSummary.asObservable();
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public setTrackingEnabled(enabled: boolean): void {
        this._isTrackingEnabled = enabled;
    }

    public setLastMatchSummaryReported(matchSummary: MatchSummary): void {
        this._lastMatchSummary.next(matchSummary);
    }

    public reportMatchSummaryToGoogleForms(
        matchSummary: MatchSummary
    ): Observable<{ success: boolean; error?: unknown }> {
        const url = Config.googleFormUrl;

        const params = {
            "entry.894638192": getFriendlyLegendName(matchSummary.legend) ?? "",
            "entry.424316428": matchSummary.map ?? "",
            "entry.606820101": getFriendlyGameMode(matchSummary.gameMode) ?? "",
            "entry.2001849655": String(matchSummary.placement ?? ""),
            "entry.1889749617": String(matchSummary.damage ?? ""),
            "entry.1895879894": String(matchSummary.kills ?? ""),
        };

        return this.httpClient.get(url, { params, observe: "response", responseType: "text" }).pipe(
            takeUntil(this._unsubscribe),
            map((response) => ({
                success: response.ok,
                error: !response.ok ? response.statusText : undefined,
            })),
            retryWhen((errors) => errors.pipe(delay(RETRY_DELAY), take(MAX_RETRIES))),
            catchError((err) => of({ success: false, error: err?.message }))
        );
    }
}
