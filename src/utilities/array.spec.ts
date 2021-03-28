import { average, averageRate } from "./array";

describe("ArrayUtilities", () => {
    describe("average", () => {
        it("should average a list of numbers", () => {
            const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            const expected = 5.5;
            const actual = average(numbers);
            expect(actual).toBeCloseTo(expected, 4);
        });
    });

    describe("averageRate", () => {
        it("should find the average difference from a list of sequential numbers", () => {
            const numbers = [1, 3, 5, 8, 13];
            const expected = 3;
            const actual = averageRate(numbers);
            expect(actual).toBeCloseTo(expected, 4);
        });

        it("should find the average difference from a list of non-sequential numbers", () => {
            const numbers = [3, 1, 5, 13, 8];
            const expected = 1.25;
            const actual = averageRate(numbers);
            expect(actual).toBeCloseTo(expected, 4);
        });
    });
});
