type Condition<ArgsType extends any[] = any[]> = (...args: ArgsType) => boolean;
type Triggers<KeyType extends string = string, ArgsType extends any[] = any[]> = {
    [P in KeyType]?: Condition<ArgsType>;
};

export class TriggerConditions<KeyType extends string = string, ArgsType extends any[] = any[]> {
    constructor(public identifier: string, private triggers: Triggers<KeyType, ArgsType>) {}

    public set(key: KeyType, trigger: Condition<ArgsType[]>): void {
        if (typeof trigger !== "function") return;
        this.triggers[key] = trigger;
    }

    public remove(key: KeyType): void {
        if (!this.triggers || typeof this.triggers[key] !== "function") return;
        delete this.triggers[key];
    }

    public triggeredFirstKey(...args: ArgsType): Optional<KeyType> {
        return this.getTriggeredKeys(true, ...args)?.[0];
    }

    public triggeredKeys(...args: ArgsType): KeyType[] {
        return this.getTriggeredKeys(false, ...args);
    }

    private getTriggeredKeys(stopOnFirst = false, ...args: ArgsType): KeyType[] {
        const triggeredArr: KeyType[] = [];
        for (const key in this.triggers) {
            if (!Object.prototype.hasOwnProperty.call(this.triggers, key)) continue;
            const isTriggeredFn = this.triggers[key];
            if (typeof isTriggeredFn !== "function") continue;
            if (!isTriggeredFn(...args)) continue;

            console.debug(`[${this.constructor.name}] [${this.identifier}] Triggered (${key}) triggered by:`, ...args);
            triggeredArr.push(key as KeyType);
            if (stopOnFirst) break;
        }
        return triggeredArr;
    }
}
