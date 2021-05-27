import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import {
    Assumptions,
    Common,
    Configuration,
    Facts,
    FeatureConfigs,
    FeatureFlags,
    General,
    OverwolfQuirks,
} from "@allfather-app/configs/config.interface";
import ConfigJSONData from "@allfather-app/configs/config.json";
import { HttpClient } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { catchError, map, takeUntil, tap, timeout } from "rxjs/operators";
import { isEmpty } from "shared/utilities";

export enum ConfigLoadStatus {
    NotStarted,
    Failed,
    Loading,
    Loaded,
    /** Used when HTTP call failed, but fallback/default config was loaded. */
    LoadedFallback,
}

@Injectable({
    providedIn: "root",
    deps: [HttpClient],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("ConfigurationService", ConfigurationService, deps),
})
export class ConfigurationService implements Configuration, OnDestroy {
    public loadStatus$ = new BehaviorSubject<ConfigLoadStatus>(ConfigLoadStatus.NotStarted);

    public assumptions!: Assumptions;
    public common!: Common;
    public facts!: Facts;
    public featureConfigs!: FeatureConfigs;
    public featureFlags!: FeatureFlags;
    public general!: General;
    public overwolfQuirks!: OverwolfQuirks;

    private destroy$ = new Subject<void>();

    constructor(private readonly http: HttpClient) {
        this.loadAppConfig().pipe(takeUntil(this.destroy$)).subscribe();
    }

    public loadAppConfig(): Observable<ConfigLoadStatus> {
        if (this.loadStatus$.value === ConfigLoadStatus.Loaded) return of(ConfigLoadStatus.Loaded);
        if (this.loadStatus$.value === ConfigLoadStatus.LoadedFallback) return of(ConfigLoadStatus.LoadedFallback);

        this.loadStatus$.next(ConfigLoadStatus.Loading);

        // return this.http
        //     .get<Configuration>("config.json")

        return of(ConfigJSONData).pipe(
            timeout(30000),
            tap((configData) => this.bootstrapData(configData)),
            map((configData) => {
                if (!isEmpty(configData) && !isEmpty(this.common)) return ConfigLoadStatus.Loaded;
                else return ConfigLoadStatus.Failed;
            }),
            catchError(() => of(ConfigLoadStatus.Failed)),
            tap((status) => this.loadStatus$.next(status))
        );
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private bootstrapData(configData: Configuration): void {
        Object.entries(configData).forEach(([key, value]) => {
            (this as any)[key] = value;
        });
    }
}
