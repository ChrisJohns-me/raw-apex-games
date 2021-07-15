import { BackgroundService } from "@allfather-app/app/modules/background/background.service";
import { SingletonServiceContainerService } from "@allfather-app/app/modules/background/singleton-service-container.service";
import { OverwolfFeatureDep } from "@shared-app/feature-status";

export class MockBackgroundService implements MockedClass<BackgroundService> {
    public exitApp(): void {}

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }

    // Singleton service container
    public singletonServiceContainer!: SingletonServiceContainerService;
}
