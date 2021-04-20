import { BehaviorSubject } from "rxjs";
import { ConditionOption } from "./condition-options";
import { RunCondition } from "./run-condition";

export enum ReportingEngineId {
    Local = "local",
    GoogleSheets = "googlesheets",
    Twitter = "twitter",
}

export enum ReportingStatus {
    WAITING = "waiting",
    CRITERIA_NOT_MET = "criteria_not_met",
    IN_PROGRESS = "in_progress",
    SUCCESS = "success",
    FAIL = "fail",
}

export interface ReportingEngine {
    engineId: ReportingEngineId;
    reportingStatus$: BehaviorSubject<ReportingStatus>;
    availableConditionOptions: ConditionOption[];
    runConditions: RunCondition[];
    isRunAlways: boolean;

    teardown(): void;
    reset(): void;
    /**
     * Give the engine an opportunity to run; depending on the runConditions.
     */
    runOpportunity(): void;
}
