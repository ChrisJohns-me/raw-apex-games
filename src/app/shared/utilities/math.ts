/**
 * Restricts the number to be within the inclusive lower and upper bounds.
 */
export function mathClamp(inputNumber: number, min: number, max: number): number {
    return Math.min(Math.max(inputNumber, min), max);
}
