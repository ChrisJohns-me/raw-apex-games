import { OverwolfFeatureDep } from "@raw-apex-games-app/app/common/feature-status";
import { SessionStorageService } from "../../session-storage/session-storage.service";

export class MockSessionStorageService implements MockedClass<SessionStorageService> {
    public get(...args: Parameters<SessionStorageService["get"]>): ReturnType<SessionStorageService["get"]> {
        return "";
    }

    public set(...args: Parameters<SessionStorageService["set"]>): ReturnType<SessionStorageService["set"]> {
        return;
    }

    public clearItem(...args: Parameters<SessionStorageService["clearItem"]>): ReturnType<SessionStorageService["clearItem"]> {
        return;
    }

    public clearItems(...args: Parameters<SessionStorageService["clearItems"]>): ReturnType<SessionStorageService["clearItems"]> {
        return;
    }

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
