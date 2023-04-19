import { BehaviorSubject, Observable, ReplaySubject } from "rxjs";
import { isEmpty } from "../../../../../../../../common/utilities/";
import { Configuration } from "../../../../../configs/config.interface";
import ConfigJSONData from "../../../../../configs/config.json";
import { ConfigLoadStatus, ConfigurationService } from "../../configuration.service";

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
