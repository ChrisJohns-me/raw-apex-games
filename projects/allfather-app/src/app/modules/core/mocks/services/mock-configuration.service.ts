import { ConfigLoadStatus, ConfigurationService } from "@allfather-app/app/modules/core/configuration.service";
import { Configuration } from "@allfather-app/configs/config.interface";
import ConfigJSONData from "@allfather-app/configs/config.json";
import { BehaviorSubject, Observable, ReplaySubject } from "rxjs";
import { isEmpty } from "shared/utilities";

/**
 * Loads default config (from config.json) on instantiation.
 */
export class MockConfigurationService implements MockedClass<ConfigurationService> {
    public loadStatus$: BehaviorSubject<ConfigLoadStatus> = new BehaviorSubject<ConfigLoadStatus>(ConfigLoadStatus.NotStarted);
    public config$: ReplaySubject<Configuration> = new ReplaySubject<Configuration>(1);
    public defaultConfig: Configuration = {} as Configuration;

    public mockLoadStatus$ = new BehaviorSubject<ConfigLoadStatus>(ConfigLoadStatus.Loading);

    constructor() {
        this.mockSetDefaultConfig();
    }

    public load$(): Observable<ConfigLoadStatus> {
        return this.mockLoadStatus$;
    }

    public mockSetConfig(configuration: Configuration): void {
        this.config$.next(configuration);
        this.mockLoadStatus$.next(ConfigLoadStatus.Loaded);
    }

    /**
     * @param configuration if undefined, will load config.json
     */
    public mockSetDefaultConfig(configuration?: Configuration): void {
        if (!configuration) {
            this.loadDefaultConfig();
            return;
        }
        this.defaultConfig = configuration;
    }

    private loadDefaultConfig(): void {
        if (isEmpty(this.defaultConfig)) this.defaultConfig = {} as Configuration;
        Object.entries(ConfigJSONData).forEach(([key, value]) => {
            (this.defaultConfig as any)[key] = value;
        });
    }
}
