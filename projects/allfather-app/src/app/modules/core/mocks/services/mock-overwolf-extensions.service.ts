import { OverwolfFeatureDep } from "@allfather-app/app/common/feature-status";
import { OverwolfExtensionsService } from "@allfather-app/app/modules/core/overwolf/overwolf-extensions.service";
import { ExtractSubjectType } from "common/types/rxjs-utilities";
import { of, Subject } from "rxjs";

export class MockOverwolfExtensionsService implements MockedClass<OverwolfExtensionsService> {
    public appLaunchTriggeredEvent$: OverwolfExtensionsService["appLaunchTriggeredEvent$"] = new Subject<
        ExtractSubjectType<OverwolfExtensionsService["appLaunchTriggeredEvent$"]>
    >();

    public relaunchApp(): void {}

    public getManifest(): ReturnType<OverwolfExtensionsService["getManifest"]> {
        return of();
    }

    public writeTextFile(
        ...args: Parameters<OverwolfExtensionsService["writeTextFile"]>
    ): ReturnType<OverwolfExtensionsService["writeTextFile"]> {
        return of();
    }

    public exist(...args: Parameters<OverwolfExtensionsService["exist"]>): ReturnType<OverwolfExtensionsService["writeTextFile"]> {
        return of();
    }

    public createDirectory(
        ...args: Parameters<OverwolfExtensionsService["createDirectory"]>
    ): ReturnType<OverwolfExtensionsService["createDirectory"]> {
        return of();
    }

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
