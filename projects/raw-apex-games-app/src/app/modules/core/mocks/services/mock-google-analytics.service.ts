import { OverwolfFeatureDep } from "@raw-apex-games-app/app/common/feature-status";
import { GoogleAnalyticsService } from "@raw-apex-games-app/app/modules/core/google-analytics.service";

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
