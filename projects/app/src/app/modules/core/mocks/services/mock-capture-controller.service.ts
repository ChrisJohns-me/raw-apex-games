import { OverwolfFeatureDep } from "../../../../common/feature-status";
import { CaptureControllerService } from "../../../../modules/background/capture-controller.service";

export class MockCaptureControllerService implements MockedClass<CaptureControllerService> {
    public startWatchEvents(): void {}

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
