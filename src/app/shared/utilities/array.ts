/**
 * @description Average of numbers in array.
 * @example average([1,2,3,4,5]) = 3
 */
export function average(nums: number[]): number {
    const sum = nums.reduce((acc, next) => acc + next);
    const avg = sum / nums.length;
    return avg;
}

/**
 * @summary Calculates the average difference of numbers in an array.
 *          Important to note the order!
 * @example averageRate([1,3,5,8,13]) = 3
 * @example averageRate([3,1,5,13,8]) = 1.25
 * @returns {Number} Average difference between values.
 */
export function averageRate(nums: number[]): number {
    const rateDiffs = nums
        .map((curr, i, arr) => {
            const next = arr[i + 1];
            if (next == null || !isFinite(next)) return;
            const diff = next - curr;
            return diff;
        })
        .filter((n) => typeof n !== "undefined") as number[];

    return average(rateDiffs);
}
