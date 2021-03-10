/**
 * @example parseBoolean("true") == true
 * @example parseBoolean(" TRUE  ") == true
 * @example parseBoolean("false") == false
 * @example parseBoolean("") == false
 * @param {any} input
 * @returns {boolean}
 */
export function parseBoolean(input: any): boolean {
    return input === true || (typeof input === "string" && input.toLowerCase().trim() === "true");
}
