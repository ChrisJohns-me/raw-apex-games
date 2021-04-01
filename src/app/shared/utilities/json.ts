import { parseBoolean } from "./boolean";

export function JSONTryParse<T = AnyObject>(text?: string, onError?: (err?: any) => void): Optional<T> {
    if (!text || !text.length) return undefined;
    try {
        return JSON.parse(text) as T;
    } catch (error) {
        if (typeof onError === "function") onError(error);
        return undefined;
    }
}

/**
 * Attempts to parse JSON with a given input.
 * Traverses through an object to parse any values that may be JSON.
 * Does not parse JSON within JSON.
 *
 * Casts "null"|"undefined" to null
 * Casts "true" to true, "false" to false
 */
export function recursiveJSONParse<T = any>(obj: any): any {
    if (typeof obj === "string") {
        if (obj === "null" || obj === "undefined") return null;
        else if (obj.trim() === "true" || obj.trim() === "false") return parseBoolean(obj);
        else if ((obj as string).trim().startsWith("{") && (obj as string).trim().endsWith("}")) {
            return (JSONTryParse(obj) as T) ?? ((obj as unknown) as T);
        } else return obj;
    } else if (!!obj && typeof obj === "object") {
        const newObj = { ...obj };
        for (const key in obj) {
            if (!Object.prototype.hasOwnProperty.call(newObj, key)) continue;
            newObj[key] = recursiveJSONParse(newObj[key]);
        }
        return newObj;
    } else {
        return obj;
    }
}
