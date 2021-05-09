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
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";

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

        return this.http
            .get<Configuration>("config.json")
            .pipe(
                tap((configData) => {
                    if (configData) {
                        this.receivedData(configData);
                        this.isLoaded = true;
                    }
                })
            )
            .toPromise();
    }

    private receivedData(configData: Configuration): void {
        Object.entries(configData).forEach(([key, value]) => {
            (this as any)[key] = value;
        });
    }
}
