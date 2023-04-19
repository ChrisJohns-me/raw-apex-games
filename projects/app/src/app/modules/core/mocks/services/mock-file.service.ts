import { of } from "rxjs";
import { OverwolfFeatureDep } from "../../../../common/feature-status";
import { FileService } from "../../file.service";

export class MockFileService implements MockedClass<FileService> {
    public saveFile$(...args: Parameters<FileService["saveFile$"]>): ReturnType<FileService["saveFile$"]> {
        return of("");
    }

    public getStoragePath$(...args: Parameters<FileService["getStoragePath$"]>): ReturnType<FileService["getStoragePath$"]> {
        return of("");
    }

    public ensureDirectory$(directory: string): ReturnType<FileService["ensureDirectory$"]> {
        return of(true);
    }

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
