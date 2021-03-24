/**
 * @example "true", " TRUE  " == true
 * @example "false", "" == false
 */
export function parseBoolean(input: any): boolean {
    return input === true || (typeof input === "string" && input.toLowerCase().trim() === "true");
}

/**
 * @summary Check if input is empty, null, undefined, or not a number
 * @example "", null, undefined, {} == true
 * @example 0, 1, 2 == false
 * @example "foo", "0", "1", "2" == false
 * @example {"key": "value"}, {"key": undefined} == false
 */
export function isEmpty(value?: any): boolean {
    if (!isNaN(value)) return false;
    if (typeof value === "string") return !value.trim();
    if (
        value instanceof Date ||
        (typeof value === "object" && Object.prototype.toString.call(value) === "[object Date]")
    )
        return false;
    if (typeof value === "object") {
        return !value || !Object.keys(value).length;
    }
    return !value;
}
