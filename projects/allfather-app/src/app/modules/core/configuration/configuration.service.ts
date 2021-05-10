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
import * as ConfigJSONData from "@allfather-app/configs/config.json";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class ConfigurationService implements Configuration {
    public assumptions!: Assumptions;
    public common!: Common;
    public facts!: Facts;
    public featureConfigs!: FeatureConfigs;
    public featureFlags!: FeatureFlags;
    public general!: General;
    public overwolfQuirks!: OverwolfQuirks;

    private isLoaded = false;

    constructor(private readonly http: HttpClient) {}

    public loadAppConfig(): Promise<any> {
        if (this.isLoaded) Promise.reject(`Configuration is already loaded`);

        return new Promise((resolve) => {
            const config = this.receivedData(ConfigJSONData);
            this.isLoaded = true;
            resolve(config);
        });
        // return this.http
        //     .get<Configuration>("config.json")
        //     .pipe(
        //         tap((configData) => {
        //             if (configData) {
        //                 this.receivedData(configData);
        //                 this.isLoaded = true;
        //             }
        //         })
        //     )
        //     .toPromise();
    }

    private receivedData(configData: Configuration): void {
        Object.entries(configData).forEach(([key, value]) => {
            (this as any)[key] = value;
        });
    }
}
