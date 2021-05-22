import { BackgroundService } from "@allfather-app/app/modules/background/background.service";
import { BehaviorSubject } from "rxjs";
import { OverwolfFeatureDep } from "../../overwolf/overwolf-feature-status.service";

export class MockBackgroundService implements MockedClass<BackgroundService> {
    public isRequestingExit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public requestExit(): void {}
    public cancelExit(): void {}
    public relaunchApp(): void {}
    public exitApp(): void {}
    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }
    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
