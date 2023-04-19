import { of, Subject } from "rxjs";
import { ExtractSubjectType } from "../../../../../../../../common/types/rxjs-utilities";
import { OverwolfFeatureDep } from "../../../../common/feature-status";
import { OverwolfExtensionsService } from "../../overwolf/overwolf-extensions.service";

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
        return of(true);
    }

    public getStoragePath(
        ...args: Parameters<OverwolfExtensionsService["getStoragePath"]>
    ): ReturnType<OverwolfExtensionsService["getStoragePath"]> {
        return of("");
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
