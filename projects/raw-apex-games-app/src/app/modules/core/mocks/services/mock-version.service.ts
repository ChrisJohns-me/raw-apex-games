import { BehaviorSubject } from "rxjs";
import { VersionService } from "../../version.service";

export class MockVersionService implements MockedClass<VersionService> {
    public packageVersion$ = new BehaviorSubject<string>("");
    public overwolfExtensionVersion$ = new BehaviorSubject<string>("");
}
