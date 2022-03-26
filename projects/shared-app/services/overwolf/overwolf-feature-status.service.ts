import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, OnDestroy } from "@angular/core";
import { FeatureState, FeatureStatusList, OverwolfFeatureDep } from "@shared-app/feature-status";
import { SingletonServiceProviderFactory } from "@shared-app/singleton-service.provider.factory";
import { BehaviorSubject, Observable, of, Subject, throwError, timer } from "rxjs";
import { catchError, delay, map, mergeMap, retryWhen, switchMap, takeUntil, tap } from "rxjs/operators";
import { OverwolfGameDataStatusDTO } from "./dto/overwolf-feature-status-dto";
import { OWConfig, OW_CONFIG } from "./overwolf-config";

/**
 * @classdesc Retrieves the feature statuses from Overwolf periodically.
 */
@Injectable({
    providedIn: "root",
    deps: [HttpClient, OW_CONFIG],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("OverwolfFeatureStatusService", OverwolfFeatureStatusService, deps),
})
export class OverwolfFeatureStatusService implements OnDestroy {
    public readonly featureStatusList$ = new BehaviorSubject<FeatureStatusList>({});

    private destroy$ = new Subject<void>();

    constructor(private readonly http: HttpClient, @Inject(OW_CONFIG) private readonly owConfig: OWConfig) {
        this.setupFeatureStatusHealthCheck();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Retrieves one of Overwolf's game event data status via HTTP call.
     * @returns Event names and their Overwolf status.
     * @returns Empty on HTTP errors or JSON deserialization errors.
     */
    public checkFeatureStatus(featureName: OverwolfFeatureDep): FeatureState {
        const statusList = this.featureStatusList$.value;
        return featureName in statusList ? statusList[featureName]! : FeatureState.Unavailable;
    }

    /**
     * @returns Retrieves the last known overview of all Overwolf feature status
     */
    public checkAllFeatureStatus(): FeatureState {
        const statusListArr = Object.values(this.featureStatusList$.value);
        if (!statusListArr?.length) return FeatureState.Unavailable;
        if (statusListArr.every((s) => s === FeatureState.Good)) return FeatureState.Good;
        if (statusListArr.filter((s) => s === FeatureState.Unsupported).length <= 3) return FeatureState.Good;
        if (statusListArr.some((s) => s === FeatureState.Partial)) return FeatureState.Partial;
        if (statusListArr.every((s) => s === FeatureState.Unavailable)) return FeatureState.Unavailable;
        if (statusListArr.some((s) => s === FeatureState.Unavailable)) return FeatureState.Partial;
        if (statusListArr.every((s) => s === FeatureState.Unsupported)) return FeatureState.Unsupported;
        return FeatureState.Unavailable;
    }

    /**
     * Retrieves all Overwolf's game event data status via HTTP call.
     * Updates this service's public status list (even if error).
     * @returns Event names and their Overwolf status.
     * @returns Empty on HTTP errors or JSON deserialization errors.
     */
    public getFeatureStatusList$(): Observable<FeatureStatusList> {
        const gameStatusUrl = `https://game-events-status.overwolf.com/${this.owConfig.APEXLEGENDSCLASSID.toString()}_prod.json`;

        return this.http.get(gameStatusUrl, { responseType: "json" }).pipe(
            takeUntil(this.destroy$),
            map((gameDataStatusJSON) => new OverwolfGameDataStatusDTO(gameDataStatusJSON)),
            map((gameDataStatusDTO) => gameDataStatusDTO.toFeatureStatusList()),
            retryWhen((errors) => this.retry$(errors)),
            catchError(() => of({} as FeatureStatusList)),
            tap((statusList) => this.featureStatusList$.next(statusList))
        );
    }

    private setupFeatureStatusHealthCheck(): void {
        timer(0, this.owConfig.FEATURE_HEALTHCHECK_TIME)
            .pipe(
                takeUntil(this.destroy$),
                switchMap(() => this.getFeatureStatusList$()),
                tap((statusList) =>
                    console.debug(`[${this.constructor.name}] (Feature Status Check) Status: "this.checkAllFeatureStatus()"`, statusList)
                )
            )
            .subscribe();
    }

    private retry$(errors: Observable<any>): Observable<any> {
        return errors.pipe(
            mergeMap((error, i) => {
                const retryAttempt = i + 1;
                if (retryAttempt >= this.owConfig.FEATURE_HEALTHCHECK_RETRY_COUNT) {
                    return throwError(error);
                }
                console.warn(
                    `[${this.constructor.name}] Unable to get feature health status from Overwolf. Retrying...(#${retryAttempt})\n` +
                        `Error: ${error?.message ?? JSON.stringify(error)}`
                );
                const delayMs = retryAttempt * this.owConfig.FEATURE_HEALTHCHECK_RETRY_DELAY_MULTIPLIER;
                return of(error).pipe(delay(delayMs));
            })
        );
    }
}