import { Subject } from "rxjs";
import { ExtractSubjectType } from "../../../../../../../../common/types/rxjs-utilities";
import { OverwolfFeatureDep } from "../../../../common/feature-status";
import { OverwolfInputTrackingService } from "../../overwolf/overwolf-input-tracking.service";

export class MockOverwolfInputTrackingService implements MockedClass<OverwolfInputTrackingService> {
    public mouseDown$: OverwolfInputTrackingService["mouseDown$"] = new Subject<
        ExtractSubjectType<OverwolfInputTrackingService["mouseDown$"]>
    >();

    public mouseUp$: OverwolfInputTrackingService["mouseUp$"] = new Subject<ExtractSubjectType<OverwolfInputTrackingService["mouseUp$"]>>();

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
