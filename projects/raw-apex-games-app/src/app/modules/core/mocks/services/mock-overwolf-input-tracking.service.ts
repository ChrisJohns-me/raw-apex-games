import { OverwolfFeatureDep } from "@raw-apex-games-app/app/common/feature-status";
import { OverwolfInputTrackingService } from "@raw-apex-games-app/app/modules/core/overwolf/overwolf-input-tracking.service";
import { ExtractSubjectType } from "common/types/rxjs-utilities";
import { Subject } from "rxjs";

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
