import { average, averageRate } from "./array";

describe("ArrayUtilities", () => {
    describe("average", () => {
        it("should average a list of numbers", () => {
            // Arrange
            const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            const expected = 5.5;
            // Act
            const actual = average(numbers);
            // Assert
            expect(actual).toBeCloseTo(expected, 4);
        });
    });

    describe("averageRate", () => {
        it("should find the average difference from a list of sequential numbers", () => {
            // Arrange
            const numbers = [1, 3, 5, 8, 13];
            const expected = 3;
            // Act
            const actual = averageRate(numbers);
            // Assert
            expect(actual).toBeCloseTo(expected, 4);
        });

        it("should find the average difference from a list of non-sequential numbers", () => {
            // Arrange
            const numbers = [3, 1, 5, 13, 8];
            const expected = 1.25;
            // Act
            const actual = averageRate(numbers);
            // Assert
            expect(actual).toBeCloseTo(expected, 4);
        });
    });
});
