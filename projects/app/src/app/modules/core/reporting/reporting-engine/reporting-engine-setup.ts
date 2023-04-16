import { ReportableDataFactoryMap } from "./reportable-data";
import { ReportingEngineId } from "./reporting-engine";
import { RunCondition } from "./run-condition";

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
