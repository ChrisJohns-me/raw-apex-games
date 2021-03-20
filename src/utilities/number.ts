/** Parses input to an integer, defaults to 0 if not a valid integer. */
export function cleanInt(input: unknown): number {
    const output = parseInt(String(input));
    if (isNaN(output)) return 0;
    return output;
}

/** Parses input to a float, defaults to 0 if not a valid float. */
export function cleanFloat(input: unknown): number {
    const output = parseFloat(String(input));
    if (isNaN(output)) return 0;
    return output;
}
