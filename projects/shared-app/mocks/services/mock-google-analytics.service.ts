import { OverwolfFeatureDep } from "@shared-app/feature-status";
import { GoogleAnalyticsService } from "@shared-app/services/google-analytics.service";

export class MockGoogleAnalyticsService implements MockedClass<GoogleAnalyticsService> {
    public sendEvent(eventCategory: string, eventAction: string, eventLabel?: string, eventValue?: number): void {}

    public sendPageview(title: string, page: string): void {}

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
