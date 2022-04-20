import { OverwolfFeatureDep } from "@allfather-app/app/common/feature-status";
import { LocalStorageService } from "../../local-storage/local-storage.service";

export class MockLocalStorageService implements MockedClass<LocalStorageService> {
    public get(...args: Parameters<LocalStorageService["get"]>): ReturnType<LocalStorageService["get"]> {
        return "";
    }

    public set(...args: Parameters<LocalStorageService["set"]>): ReturnType<LocalStorageService["set"]> {
        return;
    }

    public clearItem(...args: Parameters<LocalStorageService["clearItem"]>): ReturnType<LocalStorageService["clearItem"]> {
        return;
    }

    public clearItems(...args: Parameters<LocalStorageService["clearItems"]>): ReturnType<LocalStorageService["clearItems"]> {
        return;
    }

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
