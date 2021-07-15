import { OverwolfFeatureDep } from "@shared-app/feature-status";
import { FileService } from "@shared-app/services/file.service";
import { of } from "rxjs";

export class MockFileService implements MockedClass<FileService> {
    public saveFile$(filePath: string, content: string): ReturnType<FileService["saveFile$"]> {
        return of(true);
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
