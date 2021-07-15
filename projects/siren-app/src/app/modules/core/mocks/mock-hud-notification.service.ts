import { OverwolfFeatureDep } from "@shared-app/feature-status";
import { ReplaySubject } from "rxjs";
import { HUDNotification } from "../../hud-notification/hud-notification";
import { HUDNotificationService } from "../../hud-notification/windows/hud-notification.service";

export class MockHUDNotificationService implements MockedClass<HUDNotificationService> {
    public notification$ = new ReplaySubject<HUDNotification>();

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
