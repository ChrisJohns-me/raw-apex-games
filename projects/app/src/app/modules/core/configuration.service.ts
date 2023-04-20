import { HttpClient } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import ConfigJSONDataDev from "@app/../configs/config.dev.json";
import { Configuration } from "@app/../configs/config.interface.js";
import ConfigJSONDataProd from "@app/../configs/config.prod.json";
import { environment } from "@app/../environments/environment.js";
import { SingletonServiceProviderFactory } from "@app/singleton-service.provider.factory.js";
import { isEmpty } from "@shared/utilities/primitives/boolean.js";
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

const CONFIG_URL = environment.DEV ? `https://TODO.com/config.json` : `https://TODO.com/config.prod.json`;

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
        return this.getRemoteConfig().pipe(
            takeUntil(this.destroy$),
            catchError((err) => {
                console.warn(`Error while trying to load configuration from API; ${err}`);
                isFallbackConfig = true;
                return of(this.defaultConfig);
            }),
            map((configData) => {
                if (!isEmpty(configData)) {
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

    private getRemoteConfig(): Observable<Configuration> {
        return this.http.get<Configuration>(CONFIG_URL).pipe(timeout(30000));
    }

    private loadDefaultConfig(): void {
        if (isEmpty(this.defaultConfig)) this.defaultConfig = {} as Configuration;

        const ConfigJSONData = environment.DEV ? ConfigJSONDataDev : ConfigJSONDataProd;
        Object.entries(ConfigJSONData).forEach(([key, value]) => {
            (this.defaultConfig as any)[key] = value;
        });
    }
}
