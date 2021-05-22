import { BehaviorSubject, of } from "rxjs";
import { ExtractSubjectType } from "shared/types/rxjs-utilities";
import { OverwolfFeatureRegistrationService, OWFeatureRegistrationStatus } from "../../overwolf/overwolf-feature-registration.service";
import { OverwolfFeatureDep } from "../../overwolf/overwolf-feature-status.service";

export class MockOverwolfFeatureRegistrationService implements MockedClass<OverwolfFeatureRegistrationService> {
    public registrationStatus$: OverwolfFeatureRegistrationService["registrationStatus$"] = new BehaviorSubject<
        ExtractSubjectType<OverwolfFeatureRegistrationService["registrationStatus$"]>
    >(OWFeatureRegistrationStatus.NOT_REGISTERED);

    public setRegisteredFeatures(
        ...args: Parameters<OverwolfFeatureRegistrationService["setRegisteredFeatures"]>
    ): ReturnType<OverwolfFeatureRegistrationService["setRegisteredFeatures"]> {
        return of();
    }

    public unregisterFeatures(
        ...args: Parameters<OverwolfFeatureRegistrationService["unregisterFeatures"]>
    ): ReturnType<OverwolfFeatureRegistrationService["unregisterFeatures"]> {
        return of();
    }

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
