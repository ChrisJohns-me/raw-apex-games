import { OverwolfFeatureDep } from "@allfather-app/app/common/feature-status";
import { ReportingEngineId } from "@allfather-app/app/modules/core/reporting/reporting-engine/reporting-engine";
import { ReportingService } from "@allfather-app/app/modules/core/reporting/reporting.service";
import { ExtractSubjectType } from "common/types/rxjs-utilities";
import { Subject } from "rxjs";

export class MockReportingService implements MockedClass<ReportingService> {
    public reportingEvent$: ReportingService["reportingEvent$"] = new Subject<ExtractSubjectType<ReportingService["reportingEvent$"]>>();
    public runningReportingEngines: ReportingService["runningReportingEngines"] = [];

    public restartEngines(engineIds?: ReportingEngineId | ReportingEngineId[]): ReturnType<ReportingService["restartEngines"]> {
        return;
    }

    public stopEngines(engineIds?: ReportingEngineId | ReportingEngineId[]): ReturnType<ReportingService["stopEngines"]> {
        return;
    }

    public restartEngine(engineId: ReportingEngineId): ReturnType<ReportingService["restartEngine"]> {
        return;
    }

    public stopEngine(engineId: ReportingEngineId): ReturnType<ReportingService["stopEngine"]> {
        return;
    }

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
