import { parseBoolean } from "./boolean.js";
import { JSONTryParse } from "./json.js";

/**
 * @description Uses .find() with RegExp.
 * @example findKeyByKeyRegEx({ key_99: "foo" }, /^key_/) = key_99
 */
export function findKeyByKeyRegEx(obj: Optional<AnyObject>, regEx: RegExp): Optional<string> {
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
 * @summary Similar to `incrementedKeysToValueArray()`, but also maps the property key.
 * @description Iterates over an object's keys using RegExp to create a key index object from the key's numeric value.
 *              Requires one group within the RegExp; typically should be: `(\d+)`
 * @returns Array-like object of filtered properties with mapped index key.
 * @example incrementedKeysToKeyedObject({unrelated_key: "empty", key_0: "value0", key_1: "value1", key_2: "value2"}, /^key_(\d+)/)
 * @returns {0: "value0", 1: "value1", 2: "value2"}
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

/**
 * @summary Creates an array derived from filtering an object's keys using RegExp.
 * @returns Array of filtered properties.
 * @example incrementedKeysToValueArray({unrelated_key: "empty", key_0: "value0", key_1: "value1", key_2: "value2"}, /^key_/)
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
 * Attempts to parse JSON with a given input.
 * Traverses through an object to parse any values that may be JSON.
 * Does not parse JSON strings within JSON strings.
 */
export function recursiveJSONParse<T = any>(obj: any): any {
    if (typeof obj === "string") {
        if ((obj as string).trim().startsWith("{") && (obj as string).trim().endsWith("}")) {
            return (JSONTryParse(obj) as T) ?? (obj as unknown as T);
        } else return obj;
    } else if (obj && typeof obj === "object") {
        const newObj = { ...obj };
        for (const key in obj) {
            if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
            newObj[key] = recursiveJSONParse(obj[key]);
        }
        return newObj;
    } else {
        return obj;
    }
}

/**
 * Traverses through an object to parse any string boolean values.
 */
export function recursiveParseBoolean<T = any>(obj: any): any {
    if (typeof obj === "string" && (obj.trim() === "true" || obj.trim() === "false")) {
        return parseBoolean(obj);
    } else if (obj && typeof obj === "object") {
        const newObj = { ...obj };
        for (const key in obj) {
            if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
            newObj[key] = recursiveParseBoolean(obj[key]);
        }
        return newObj;
    } else {
        return obj;
    }
}

/**
 * Traverses through an object to parse any string null values.
 */
export function recursiveParseNull<T = any>(obj: any): any {
    if (typeof obj === "string" && (obj.trim() === "null" || obj.trim() === "undefined")) {
        return null;
    } else if (obj && typeof obj === "object") {
        const newObj = { ...obj };
        for (const key in obj) {
            if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
            newObj[key] = recursiveParseNull(obj[key]);
        }
        return newObj;
    } else {
        return obj;
    }
}

/**
 * Traverses through an object to convert empty objects to null values.
 */
export function recursiveEmptyObjectsToNull<T = any>(obj: any): any {
    if (obj && typeof obj === "object") {
        if (Object.keys(obj).length === 0) {
            return null;
        } else {
            const newObj = { ...obj };
            for (const key in obj) {
                if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
                newObj[key] = recursiveEmptyObjectsToNull(obj[key]);
            }
            return newObj;
        }
    } else {
        return obj;
    }
}

/**
 * Traverses through an object to convert empty strings to null values.
 */
export function recursiveEmptyStringsToNull<T = any>(obj: any): any {
    if (typeof obj === "string" && obj.trim() === "") {
        return null;
    } else if (obj && typeof obj === "object") {
        const newObj = { ...obj };
        for (const key in obj) {
            if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
            newObj[key] = recursiveEmptyStringsToNull(obj[key]);
        }
        return newObj;
    } else {
        return obj;
    }
}
