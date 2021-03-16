/**
 * @description Average of numbers in array.
 * @example average([1,2,3,4,5]) = 3
 */
export function average(nums: number[]): number {
    const avg = nums.reduce((acc, next) => acc + next) / nums.length;
    return avg;
}

/**
 * @summary Calculates the average difference of numbers in an array.
 *          Important to note the order!
 * @example averageRate([1,3,5,8,13]) = 3.75
 * @example averageRate([1,3,5,8,13]) = -2.5
 * @returns {Number} Average difference between values.
 */
export function averageRate(nums: number[]): number {
    let avgRate = null;
    for (let i = 0; i < nums.length; i++) {
        const curr = nums[i];
        const next = nums[i + 1];
        if (next == null || !isFinite(next)) continue;
        const change = next - curr;
        avgRate = avgRate != null ? (avgRate + change) / 2 : change;
    }
    return avgRate ?? 0;
}
