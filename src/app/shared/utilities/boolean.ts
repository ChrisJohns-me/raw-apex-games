/**
 * @summary Converts wanna-be true string to boolean.
 *          Non-strings are coerced to their respective boolean values.
 * @example "true", " TRUE  " == true
 * @example "false", "" == false
 */
export function parseBoolean(value: unknown): boolean {
    if (typeof value === "string") {
        const formattedValue = value.toLowerCase().trim();
        return formattedValue === "true";
    }

    return !!value;
}

/**
 * @summary Check if input is empty, null, undefined, or not a number
 * @example "", null, undefined, {}, [] == true
 * @example 0, 1, 2 == false
 * @example "foo", "0", "1", "2" == false
 * @example {"key": "value"}, {"key": undefined} == false
 */
export function isEmpty(value?: unknown): boolean {
    if (typeof value === "object") {
        if (value instanceof Date || (typeof value === "object" && Object.prototype.toString.call(value) === "[object Date]")) return false;
        else return !value || !Object.keys(value).length;
    }

    if (typeof value === "string") return !value.trim();
    else if (typeof value === "number" && !isNaN(value as number)) return false;

    return !value;
}
