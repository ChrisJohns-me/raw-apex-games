import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import { Assumptions, Configuration, FeatureFlags } from "src/configs/config.interface";

@Injectable()
export class ConfigurationService implements Configuration {
    public featureFlags!: FeatureFlags;
    public assumptions!: Assumptions;

    constructor(private readonly http: HttpClient) {}

    public loadAppConfig(): Promise<any> {
        return this.http
            .get<Configuration>("config.json")
            .pipe(
                tap((configData) => {
                    this.featureFlags = configData.featureFlags;
                    this.assumptions = configData.assumptions;
                })
            )
            .toPromise();
    }
}
