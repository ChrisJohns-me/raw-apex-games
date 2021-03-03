declare interface Array<T> {
    /**
     * @description Uses .find() with RegExp.
     * @example [1,2,3,4,5].average() = 3
     */
    average(): number;

    /**
     * @summary Creates an array derived from filtering an object's keys using RegExp.
     * @example [1,3,5,8,13].averageRate() = 3.6875
     * @returns {Number} Average rate of change between values.
     */
    averageRate(): number;
}

Array.prototype.average = function (): number {
    const avg = this.reduce((acc, next) => acc + next) / this.length;
    return avg;
};

Array.prototype.averageRate = function (): number {
    let avgRate = null;
    for (let i = 0; i < this.length; i++) {
        const curr = this[i];
        const next = this[i + 1];
        if (!next || isNaN(next)) continue;
        const change = next - curr;
        avgRate = avgRate ? (avgRate + change) / 2 : change;
    }
    return avgRate ?? 0;
};
