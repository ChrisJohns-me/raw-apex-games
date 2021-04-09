import * as ConfigJSON from "@allfather-app/app/../configs/config.json";
import { ConfigurationService } from "@allfather-app/app/modules/core/configuration/configuration.service";

export class MockConfigurationService implements MockedClass<ConfigurationService> {
    public assumptions: ConfigurationService["assumptions"] = ConfigJSON.assumptions;
    public facts: ConfigurationService["facts"] = ConfigJSON.facts;
    public featureConfigs: ConfigurationService["featureConfigs"] = ConfigJSON.featureConfigs;
    public featureFlags: ConfigurationService["featureFlags"] = ConfigJSON.featureFlags;
    public general: ConfigurationService["general"] = ConfigJSON.general;
    public overwolfQuirks: ConfigurationService["overwolfQuirks"] = ConfigJSON.overwolfQuirks;

    public loadAppConfig(): ReturnType<ConfigurationService["loadAppConfig"]> {
        throw new Error("Method not implemented.");
    }
}
