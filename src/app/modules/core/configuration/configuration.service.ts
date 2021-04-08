import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import { Assumptions, Configuration, Facts, FeatureConfigs, FeatureFlags, General, OverwolfQuirks } from "src/configs/config.interface";

@Injectable()
export class ConfigurationService implements Configuration {
    public assumptions!: Assumptions;
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
        // this.featureFlags = configData.featureFlags;
        // this.assumptions = configData.assumptions;
        // this.facts = configData.facts;
        // this.general = configData.general;
        // this.overwolfQuirks = configData.overwolfQuirks;
        Object.entries(configData).forEach(([key, value]) => {
            (this as any)[key] = value;
        });
    }
}
