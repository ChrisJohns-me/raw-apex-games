import * as ConfigJSON from "@allfather-app/app/../configs/config.json";
import { ConfigLoadStatus, ConfigurationService } from "@allfather-app/app/modules/core/configuration.service";
import { BehaviorSubject, Observable, of } from "rxjs";

export class MockConfigurationService implements MockedClass<ConfigurationService> {
    public loadStatus$: BehaviorSubject<ConfigLoadStatus> = new BehaviorSubject<ConfigLoadStatus>(ConfigLoadStatus.NotStarted);
    public assumptions: ConfigurationService["assumptions"] = ConfigJSON.assumptions;
    public common: ConfigurationService["common"] = ConfigJSON.common;
    public facts: ConfigurationService["facts"] = ConfigJSON.facts;
    public featureConfigs: ConfigurationService["featureConfigs"] = ConfigJSON.featureConfigs;
    public featureFlags: ConfigurationService["featureFlags"] = ConfigJSON.featureFlags;
    public general: ConfigurationService["general"] = ConfigJSON.general;
    public overwolfQuirks: ConfigurationService["overwolfQuirks"] = ConfigJSON.overwolfQuirks;

    public loadAppConfig(): Observable<ConfigLoadStatus> {
        return of(ConfigLoadStatus.Loading);
    }
}
