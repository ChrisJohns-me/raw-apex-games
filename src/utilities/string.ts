/**
 * Uppercases each word in a string.
 * @param {string} input
 * @returns
 * @example underscoreToUppercaseSpacing("test input") = "Test Input"
 */
export function wordsToUpperCase(input: string): string {
    return input
        .toLowerCase()
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(" ");
}
