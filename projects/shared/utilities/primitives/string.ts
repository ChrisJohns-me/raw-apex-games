/**
 * Uppercases each word in a string.
 * @param {string} input
 * @example "test input" == "Test Input"
 */
export function wordsToUpperCase(input: string): string {
    return input
        .toLowerCase()
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(" ");
}

// Random string generator
export function randomString(length: number): string {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

// Remove non-alphanumeric characters
export function removeNonAlphaNumeric(input: string): string {
    return input.replace(/[^a-zA-Z0-9]/g, "");
}
