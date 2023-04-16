type RunConditionConstructor = { id: string; condition: () => boolean };
/**
 * @class RunCondition
 * @classdesc Class that checks if a value evaluates to true.
 */
export class RunCondition implements RunCondition {
    public id: string;

    private condition: () => boolean;

    constructor({ id, condition }: RunConditionConstructor) {
        this.id = id;
        this.condition = condition;
    }

    public conditionMet(): boolean {
        if (typeof this.condition !== "function") {
            throw new Error(`RunCondition condition: "${this.id}" is not valid condition function. (typeof ${typeof this.condition})`);
        }
        const result = !!this.condition();
        console.info(`RunCondition condition: "${this.id}" is ${result ? "met" : "not met"}`);
        return result;
    }
}
