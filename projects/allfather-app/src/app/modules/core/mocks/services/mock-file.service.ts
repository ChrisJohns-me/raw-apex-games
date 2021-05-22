import { of } from "rxjs";
import { FileService } from "../../file.service";
import { OverwolfFeatureDep } from "../../overwolf/overwolf-feature-status.service";

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
