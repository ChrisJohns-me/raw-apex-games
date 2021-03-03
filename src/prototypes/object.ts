declare interface Object {
    /**
     * @description Uses .find() with RegExp.
     * @example findPropertyByRegEx(/^key_/)
     */
    findPropertyByRegEx<T>(regEx: RegExp): T | undefined;

    /**
     * @summary Creates an array derived from filtering an object's keys using RegExp.
     * @returns Array of filtered properties.
     * @example {unrelated_key: "empty", key_0: "value0", key_1: "value1", key_2: "value2"}.incrementedPropertyToArray(/^key_/)
     * @returns ["value0", "value1", "value2"]
     */
    incrementedPropertiesToArray<T>(regEx: RegExp): T[];
}

Object.prototype.findPropertyByRegEx = function <T = Record<string, unknown>>(regEx: RegExp): T | undefined {
    const key = Object.keys(this).find((key) => regEx.test(key));
    const value = !!key && Object.prototype.hasOwnProperty.call(this, key) ? ((this as any)[key] as T) : undefined;
    return value;
};

Object.prototype.incrementedPropertiesToArray = function <T = Record<string, unknown>>(regEx: RegExp): T[] {
    if (!Object.keys(this).length) return [];
    const arr: T[] = [];
    Object.keys(this).forEach((key) => {
        if (!regEx.test(key)) return;
        const value = (this as any)[key] as T;
        if (!value) return;
        arr.push(value);
    });
    return arr;
};
