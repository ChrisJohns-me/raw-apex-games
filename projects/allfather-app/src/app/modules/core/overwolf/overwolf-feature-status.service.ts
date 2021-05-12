import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, Observable, of, Subject, throwError, timer } from "rxjs";
import { catchError, delay, map, mergeMap, retryWhen, switchMap, takeUntil, tap } from "rxjs/operators";
import { ConfigurationService } from "../configuration.service";
import { OverwolfFeatureState, OverwolfGameDataStatusDTO } from "./dto/overwolf-feature-status-dto";
import { OWConfig, OW_CONFIG } from "./overwolf-config";

export enum OverwolfFeatureDep {
    Assist = "assist",
    Damage = "damage",
    Death = "death",
    GameMode = "game_mode",
    HealedFromKo = "healed_from_ko",
    InUse = "inUse",
    Inventory = "inventory",
    Kill = "kill",
    KillFeed = "kill_feed",
    Knockdown = "knockdown",
    KnockedOut = "knocked_out",
    LegendSelect = "legendSelect",
    Location = "location",
    MatchEnd = "match_end",
    MatchStart = "match_start",
    MatchState = "match_state",
    MatchSummary = "match_summary",
    Name = "name",
    PseudoMatchId = "pseudo_match_id",
    Respawn = "respawn",
    Roster = "roster",
    Tabs = "tabs",
    TeamInfo = "team_info",
    Teammate = "teammate",
    TotalDamageDealt = "totalDamageDealt",
    UltimateCooldown = "ultimate_cooldown",
    Victory = "victory",
    Weapons = "weapons",
}

export type FeatureStatusList = {
    [eventName in OverwolfFeatureDep]?: OverwolfFeatureState;
};

/**
 * @classdesc Retrieves the feature statuses from Overwolf periodically.
 */
@Injectable({
    providedIn: "root",
    deps: [ConfigurationService, HttpClient, OW_CONFIG],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("OverwolfFeatureStatusService", OverwolfFeatureStatusService, deps),
})
export class OverwolfFeatureStatusService implements OnDestroy {
    public readonly featureStatusList$ = new BehaviorSubject<FeatureStatusList>({});

    private isDestroyed$ = new Subject<void>();

    constructor(
        private readonly config: ConfigurationService,
        private readonly http: HttpClient,
        @Inject(OW_CONFIG) private readonly owConfig: OWConfig
    ) {
        this.setupFeatureStatusHealthCheck();
    }

    public ngOnDestroy(): void {
        this.isDestroyed$.next();
        this.isDestroyed$.complete();
    }

    /**
     * Retrieves one of Overwolf's game event data status via HTTP call.
     * @returns Event names and their Overwolf status.
     * @returns Empty on HTTP errors or JSON deserialization errors.
     */
    public checkFeatureStatus(featureName: OverwolfFeatureDep): OverwolfFeatureState {
        const statusList = this.featureStatusList$.value;
        return featureName in statusList ? statusList[featureName]! : OverwolfFeatureState.Unavailable;
    }

    /**
     * @returns An overview of all Overwolf feature status
     */
    public checkAllFeatureStatus(): OverwolfFeatureState {
        const statusListArr = Object.values(this.featureStatusList$.value);
        if (!statusListArr?.length) return OverwolfFeatureState.Unavailable;
        if (statusListArr.every((s) => s === OverwolfFeatureState.Good)) return OverwolfFeatureState.Good;
        if (statusListArr.filter((s) => s === OverwolfFeatureState.Unsupported).length <= 3) return OverwolfFeatureState.Good;
        if (statusListArr.some((s) => s === OverwolfFeatureState.Partial)) return OverwolfFeatureState.Partial;
        if (statusListArr.every((s) => s === OverwolfFeatureState.Unavailable)) return OverwolfFeatureState.Unavailable;
        if (statusListArr.some((s) => s === OverwolfFeatureState.Unavailable)) return OverwolfFeatureState.Partial;
        if (statusListArr.every((s) => s === OverwolfFeatureState.Unsupported)) return OverwolfFeatureState.Unsupported;
        return OverwolfFeatureState.Unavailable;
    }

    private setupFeatureStatusHealthCheck(): void {
        timer(0, this.owConfig.FEATURE_HEALTHCHECK_TIME)
            .pipe(
                takeUntil(this.isDestroyed$),
                switchMap(() => this.getFeatureStatusList$()),
                tap((statusList) => this.featureStatusList$.next(statusList)),
                tap((statusList) =>
                    console.debug(`[${this.constructor.name}] (Feature Status Check) Status: "this.checkAllFeatureStatus()"`, statusList)
                )
            )
            .subscribe();
    }

    /**
     * Retrieves all Overwolf's game event data status via HTTP call.
     * @returns Event names and their Overwolf status.
     * @returns Empty on HTTP errors or JSON deserialization errors.
     */
    private getFeatureStatusList$(): Observable<FeatureStatusList> {
        const url = this.config.general.overwolfGameStatusUrl.replace("${0}", this.owConfig.APEXLEGENDSCLASSID.toString());
        return this.http.get(url, { responseType: "json" }).pipe(
            map((gameDataStatusJSON) => new OverwolfGameDataStatusDTO(gameDataStatusJSON)),
            map((gameDataStatus) => transformData(gameDataStatus)),
            retryWhen((errors) => this.retry$(errors)),
            catchError(() => of({} as FeatureStatusList))
        );
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

function transformData(statusDTO: OverwolfGameDataStatusDTO): FeatureStatusList {
    return statusDTO.features.reduce((prev, curr): FeatureStatusList => {
        const appending: FeatureStatusList = {};
        curr.keys.forEach((key) => {
            const keyName = key.name as OverwolfFeatureDep;
            appending[keyName] = key.state;
        });
        return { ...prev, ...appending };
    }, {} as FeatureStatusList);
}
