/**
 * Restricts the number to be within the inclusive lower and upper bounds.
 */
export function mathClamp(inputNumber: number, min: number, max: number): number {
    return Math.min(Math.max(inputNumber, min), max);
}

/**
 * @description Average of numbers in array.
 * @example mathAverage([1,2,3,4,5]) = 3
 */
export function mathAverage(nums: number[]): number {
    const sum = nums.reduce((acc, next) => acc + next);
    const avg = sum / nums.length;
    return avg;
}

/**
 * @summary Average difference from one number to the next.
 *          Important to note the order!
 * @example mathAverageRate([1,3,5,8,13]) = 3
 * @example mathAverageRate([3,1,5,13,8]) = 1.25
 */
export function mathAverageRate(nums: number[]): number {
    const rateDiffs = nums
        .map((curr, i, arr) => {
            const next = arr[i + 1];
            if (next == null || !isFinite(next)) return;
            const diff = next - curr;
            return diff;
        })
        .filter((n) => typeof n !== "undefined") as number[];

    return mathAverage(rateDiffs);
}

/**
 * @summary Variance of an average of numbers.
 *          Good to calculate the "stability" of a list of numbers; ie. lower is more stable.
 *          (Order is not important)
 * @example mathAverageRate([5,5,5,5,5]) = 0
 * @example mathAverageRate([5,5,10,5,5]) = 1.6
 * @example mathAverageRate([10,10,10,9,10]) = 0.32
 */
export function mathAverageVariance(nums: number[]): number {
    const avg = mathAverage(nums);
    const variances = nums.map((num) => Math.abs(num - avg));
    const avgVariance = mathAverage(variances);
    return avgVariance;
}
