export function JSONTryParse<T = AnyObject>(text?: string): Optional<T> {
    if (!text || !text.length) return undefined;
    try {
        return JSON.parse(text) as T;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export function recursiveJSONParse<T = AnyObject | string>(obj: AnyObject | string): T {
    if (typeof obj === "string" && (obj as string).trim().startsWith("{") && (obj as string).trim().endsWith("}")) {
        return (JSONTryParse(obj) as T) ?? ((obj as unknown) as T);
    } else if (typeof obj === "object") {
        const newObj = { ...obj };
        for (const key in newObj) {
            if (!Object.prototype.hasOwnProperty.call(newObj, key)) continue;
            newObj[key] = recursiveJSONParse(newObj[key]);
        }
        return newObj as T;
    } else {
        return (obj as unknown) as T;
    }
}
