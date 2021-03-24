/**
 * @description Uses .find() with RegExp.
 * @example findKeyByRegEx({ key_99: "foo" }, /^key_/) = key_99
 */
export function findKeyByKeyRegEx<T extends AnyObject = AnyObject>(obj: Optional<T>, regEx: RegExp): Optional<string> {
    if (!obj) return undefined;
    const key = Object.keys(obj).find((key) => regEx.test(key));
    return key;
}

/**
 * @description Uses .find() with RegExp.
 * @example findValueByKeyRegEx({ key_99: "foo" }/^key_/) = foo
 */
export function findValueByKeyRegEx<V extends ObjectPropertyTypes<T>, T extends AnyObject = AnyObject>(
    obj: Optional<T>,
    regEx: RegExp
): Optional<V> {
    if (!obj) return undefined;
    const key = findKeyByKeyRegEx(obj, regEx);
    const value = !!key && Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
    return value;
}

/**
 * @summary Creates an array derived from filtering an object's keys using RegExp.
 * @returns Array of filtered properties.
 * @example {unrelated_key: "empty", key_0: "value0", key_1: "value1", key_2: "value2"}.incrementedPropertyToArray(/^key_/)
 * @returns ["value0", "value1", "value2"]
 */
export function incrementedKeysToValueArray<V extends ObjectPropertyTypes<T>, T extends AnyObject = AnyObject>(
    obj: Optional<T>,
    regEx: RegExp
): V[] {
    if (!obj) return [];
    const keys = Object.keys(obj);
    if (!keys.length) return [];
    const arr: V[] = [];
    keys.forEach((key) => {
        if (!Object.prototype.hasOwnProperty.call(obj, key) || !regEx.test(key)) return;
        const value = obj[key];
        arr.push(value);
    });
    return arr;
}

/**
 * @summary Similar to `incrementedPropertiesToArray()`, but also maps the property key.
 * @description Iterates over an object's keys using RegExp to create a key index object from the key's numeric value.
 *              Requires one group within the RegExp; typically should be: `(\d+)`
 * @returns Array of filtered properties with mapped index key.
 * @example {unrelated_key: "empty", key_0: "value0", key_1: "value1", key_2: "value2"}.incrementedPropertiesToKeyedArray(/^key_(\d+)/)
 * @returns [0: "value0", 1: "value1", 2: "value2"]
 */
export function incrementedKeysToKeyedObject<V extends ObjectPropertyTypes<T>, T extends AnyObject = AnyObject>(
    obj: Optional<T>,
    regEx: RegExp
): V {
    if (!obj) return {} as V;
    const keys = Object.keys(obj);
    if (!keys.length) return {} as V;
    const keyedObj = {} as V;
    keys.forEach((key) => {
        const newKeyStr = key.match(regEx)?.[1];
        if (!Object.prototype.hasOwnProperty.call(obj, key) || !newKeyStr) return;
        const value = obj[key];
        const newKey = parseInt(newKeyStr);
        keyedObj[newKey] = value;
    });

    return keyedObj;
}
