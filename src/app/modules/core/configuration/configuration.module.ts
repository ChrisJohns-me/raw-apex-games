import { APP_INITIALIZER, NgModule } from "@angular/core";
import { ConfigurationService } from "./configuration.service";

export function configServiceFactory(configService: ConfigurationService): () => Promise<any> {
    return () => configService.loadAppConfig();
}

@NgModule({
    providers: [
        ConfigurationService,
        { provide: APP_INITIALIZER, useFactory: configServiceFactory, deps: [ConfigurationService], multi: true },
    ],
})
export class ConfigurationModule {}
