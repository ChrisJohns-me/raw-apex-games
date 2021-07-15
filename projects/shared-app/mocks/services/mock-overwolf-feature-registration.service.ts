import { OverwolfFeatureDep } from "@shared-app/feature-status";
import {
    OverwolfFeatureRegistrationService,
    OWFeatureRegistrationStatus,
} from "@shared-app/services/overwolf/overwolf-feature-registration.service";
import { ExtractSubjectType } from "common/types/rxjs-utilities";
import { BehaviorSubject, of } from "rxjs";

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
