import { ReportableDataFactoryMap } from "./reportable-data.js";
import { ReportingEngineId } from "./reporting-engine.js";
import { RunCondition } from "./run-condition.js";

/**
 * @summary Player's implementation of the conditions and settings of the engine.
 */
export interface ReportingEngineSetup {
    engineId: ReportingEngineId;
    isEnabled: boolean;
    /** Conditions to allow the engine to record */
    runConditions: RunCondition[];
    /** Allowed data items to be recorded */
    enabledDataItemIds: Array<keyof ReportableDataFactoryMap>;
}
