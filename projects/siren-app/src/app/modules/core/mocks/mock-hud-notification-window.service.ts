import { OverwolfFeatureDep } from "@shared-app/feature-status";
import { Observable, of } from "rxjs";
import { HUDNotificationWindowService } from "../../hud-notification/windows/hud-notification-window.service";

export class MockHUDNotificationWindowService implements MockedClass<HUDNotificationWindowService> {
    public open(): Observable<void> {
        return of();
    }

    public close(): Observable<void> {
        return of();
    }

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
