import { OverwolfFeatureDep } from "@shared-app/feature-status";
import { ReplaySubject } from "rxjs";
import { Notification } from "../../hud-notification/notification";
import { HUDNotificationService } from "../../hud-notification/windows/hud-notification.service";

export class MockHUDNotificationService implements MockedClass<HUDNotificationService> {
    public notification$ = new ReplaySubject<Notification>();

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
