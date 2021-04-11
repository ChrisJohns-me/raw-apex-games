import { BehaviorSubject } from "rxjs";
import { OverwolfFeatureRegistrationService, OWFeatureRegistrationStatus } from "../../overwolf/overwolf-feature-registration.service";

export class MockOverwolfFeatureRegistrationService implements MockedClass<OverwolfFeatureRegistrationService> {
    public registrationStatus$: OverwolfFeatureRegistrationService["registrationStatus$"] = new BehaviorSubject<
        OverwolfFeatureRegistrationService["registrationStatus$"]["value"]
    >(OWFeatureRegistrationStatus.NOT_REGISTERED);

    public start(): void {
        throw new Error("Method not implemented.");
    }

    public registerFeatures(
        ...args: Parameters<OverwolfFeatureRegistrationService["registerFeatures"]>
    ): ReturnType<OverwolfFeatureRegistrationService["registerFeatures"]> {
        throw new Error("Method not implemented.");
    }

    public unregisterFeatures(
        ...args: Parameters<OverwolfFeatureRegistrationService["unregisterFeatures"]>
    ): ReturnType<OverwolfFeatureRegistrationService["unregisterFeatures"]> {
        throw new Error("Method not implemented.");
    }
}
