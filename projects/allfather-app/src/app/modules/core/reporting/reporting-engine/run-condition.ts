import { Timestamp } from "rxjs";
import { ConditionOption } from "./condition-options";

export enum NumberConditionComparison {
    LESSTHANOREQUALTO = "≤",
    EQUALTO = "=",
    GREATERTHANOREQUALTO = "≥",
}

export enum StringConditionComparison {
    CONTAINS = "∈",
    IS = "=",
}

export class RunCondition {
    constructor(
        public conditionValue: string | number,
        public condition: ConditionOption,
        public comparison: NumberConditionComparison | StringConditionComparison
    ) {}

    /**
     * Check value for conditions met, numbers & strings only; Arrays do not qualify to be conditional values.
     */
    public conditionMet(dataValue: unknown): boolean {
        if (!dataValue) return false;
        // Arrays not qualified to be conditional values
        if (Array.isArray(dataValue)) return false;
        // Extract value from Timestamp type
        let value = dataValue;
        if ((dataValue as Timestamp<any>)?.timestamp && (dataValue as Timestamp<any>)?.value) value = (dataValue as Timestamp<any>).value;

        let conditionMet = false;
        if (this.condition.type === "number") {
            conditionMet = this.numberMeetsCondition(
                value as number,
                this.comparison as NumberConditionComparison,
                this.conditionValue as number
            );
        } else if (this.condition.type === "string") {
            conditionMet = this.stringMeetsCondition(
                value as string,
                this.comparison as StringConditionComparison,
                this.conditionValue as string
            );
        }
        console.debug(`[${this.constructor.name}] ${value} ${this.comparison} ${this.conditionValue} = ${conditionMet.valueOf()}`);
        return conditionMet;
    }

    private numberMeetsCondition(dataValue: number, comparison: NumberConditionComparison, conditionValue: number): boolean {
        switch (comparison) {
            case NumberConditionComparison.LESSTHANOREQUALTO:
                return dataValue <= conditionValue;
            case NumberConditionComparison.EQUALTO:
                return dataValue === conditionValue;
            case NumberConditionComparison.GREATERTHANOREQUALTO:
                return dataValue >= conditionValue;
            default:
                return false;
        }
    }

    private stringMeetsCondition(dataValue: string, comparison: StringConditionComparison, conditionValue: string): boolean {
        const _dataValue = dataValue.toLowerCase().trim();
        const _conditionValue = conditionValue.toLowerCase().trim();

        switch (comparison) {
            case StringConditionComparison.CONTAINS:
                return _dataValue.includes(_conditionValue);
            case StringConditionComparison.IS:
                return _dataValue.includes(_conditionValue);
            default:
                return false;
        }
    }
}
