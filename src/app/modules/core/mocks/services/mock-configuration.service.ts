import * as ConfigJSON from "@app/../configs/config.json";
import { ConfigurationService } from "@core/configuration/configuration.service";

export class MockConfigurationService implements MockedClass<ConfigurationService> {
    public featureFlags: ConfigurationService["featureFlags"] = ConfigJSON.featureFlags;
    public assumptions: ConfigurationService["assumptions"] = ConfigJSON.assumptions;

    public loadAppConfig(): ReturnType<ConfigurationService["loadAppConfig"]> {
        throw new Error("Method not implemented.");
    }
}
