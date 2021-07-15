import { CaptureControllerService } from "@allfather-app/app/modules/background/capture-controller.service";
import { OverwolfFeatureDep } from "@shared-app/feature-status";

export class MockCaptureControllerService implements MockedClass<CaptureControllerService> {
    public startWatchEvents(): void {}

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
