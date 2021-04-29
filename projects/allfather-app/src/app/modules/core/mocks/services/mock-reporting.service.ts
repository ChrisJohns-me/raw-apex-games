import { Subject } from "rxjs";
import { ExtractSubjectType } from "shared/types/rxjs-utilities";
import { ReportingEngineId } from "../../reporting/reporting-engine/reporting-engine";
import { ReportingService } from "../../reporting/reporting.service";

export class MockReportingService implements MockedClass<ReportingService> {
    public reportingEvent$: ReportingService["reportingEvent$"] = new Subject<ExtractSubjectType<ReportingService["reportingEvent$"]>>();
    public runningReportingEngines: ReportingService["runningReportingEngines"] = [];

    public init(): void {
        throw new Error("Method not implemented.");
    }

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
}
