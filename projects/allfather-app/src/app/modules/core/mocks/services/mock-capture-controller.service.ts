import { OverwolfFeatureDep } from "@allfather-app/app/common/feature-status";
import { CaptureControllerService } from "@allfather-app/app/modules/background/capture-controller.service";

export class MockCaptureControllerService implements MockedClass<CaptureControllerService> {
    public startWatchEvents(): void {}

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
