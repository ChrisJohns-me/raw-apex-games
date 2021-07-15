import { OverwolfFeatureDep } from "@shared-app/feature-status";
import { BackgroundService } from "../../background/background.service";
import { SingletonServiceContainerService } from "../../background/singleton-service-container.service";

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
