import { HttpClient } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { SingletonServiceProviderFactory } from "@shared-app/singleton-service.provider.factory";
import { Configuration } from "@siren-app/configs/sirenconfig.interface";
import ConfigJSONData from "@siren-app/configs/sirenconfig.json";
import { environment } from "@siren-app/environments/environment";
import { isEmpty } from "common/utilities/";
import { BehaviorSubject, Observable, of, ReplaySubject, Subject } from "rxjs";
import { catchError, map, takeUntil, timeout } from "rxjs/operators";

export enum ConfigLoadStatus {
    NotStarted,
    Failed,
    Loading,
    Loaded,
    /** Used when HTTP call failed, but fallback/default config was loaded. */
    LoadedFallback,
}

const CONFIG_URL = environment.DEV ? `https://allfather.app/sirenconfig.prod.json` : `https://allfather.app/sirenconfig.prod.json`;

@Injectable({
    providedIn: "root",
    deps: [HttpClient],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("ConfigurationService", ConfigurationService, deps),
})
export class ConfigurationService implements OnDestroy {
    public config$ = new ReplaySubject<Configuration>(1);
    public loadStatus$ = new BehaviorSubject<ConfigLoadStatus>(ConfigLoadStatus.NotStarted);
    /**
     * Can be used as a default source of the configuration until the primary config observable completes.
     * And/or used as for non-vital configuration values.
     */
    public defaultConfig: Configuration = {} as Configuration;

    private destroy$ = new Subject<void>();

    constructor(private readonly http: HttpClient) {
        this.loadDefaultConfig();
        this.load$().pipe(takeUntil(this.destroy$)).subscribe();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public load$(): Observable<ConfigLoadStatus> {
        if (this.loadStatus$.value === ConfigLoadStatus.Loaded) return of(ConfigLoadStatus.Loaded);
        if (this.loadStatus$.value === ConfigLoadStatus.LoadedFallback) return of(ConfigLoadStatus.LoadedFallback);

        this.loadStatus$.next(ConfigLoadStatus.Loading);

        if (environment.forceLocalConfig) {
            console.info(`Using local configuration`);
            this.config$.next(this.defaultConfig);
            this.config$.complete();
            this.loadStatus$.next(ConfigLoadStatus.LoadedFallback);
            return of(this.loadStatus$.value);
        }

        let isFallbackConfig = false;
        return this.getAPIConfig().pipe(
            takeUntil(this.destroy$),
            catchError((err) => {
                console.warn(`Error while trying to load configuration from API; ${err}`);
                isFallbackConfig = true;
                return of(this.defaultConfig);
            }),
            map((configData) => {
                if (!isEmpty(configData) && !isEmpty(configData.common)) {
                    console.info(`Using hosted configuration`);
                    this.config$.next(configData);
                    this.config$.complete();
                    this.loadStatus$.next(isFallbackConfig ? ConfigLoadStatus.LoadedFallback : ConfigLoadStatus.Loaded);
                } else {
                    this.loadStatus$.next(ConfigLoadStatus.Failed);
                }
                return this.loadStatus$.value;
            })
        );
    }

    private getAPIConfig(): Observable<Configuration> {
        return this.http.get<Configuration>(CONFIG_URL).pipe(timeout(30000));
    }

    private loadDefaultConfig(): void {
        if (isEmpty(this.defaultConfig)) this.defaultConfig = {} as Configuration;
        Object.entries(ConfigJSONData).forEach(([key, value]) => {
            (this.defaultConfig as any)[key] = value;
        });
    }
}
