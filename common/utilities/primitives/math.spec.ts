import { mathAverage, mathAverageRate, mathAverageVariance, mathClamp } from "./math";

describe("MathUtilities", () => {
    describe("mathClamp", () => {
        it("should lower clamp to a number", () => {
            // Arrange
            const number = 0;
            const min = 100;
            const max = 200;
            // Act
            const actual = mathClamp(number, min, max);
            // Assert
            expect(actual).toEqual(100);
        });

        it("should upper clamp to a number", () => {
            // Arrange
            const number = 300;
            const min = 100;
            const max = 200;
            // Act
            const actual = mathClamp(number, min, max);
            // Assert
            expect(actual).toEqual(200);
        });
    });

    describe("mathAverage", () => {
        it("should average a list of numbers", () => {
            // Arrange
            const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            const expected = 5.5;
            // Act
            const actual = mathAverage(numbers);
            // Assert
            expect(actual).toBeCloseTo(expected, 4);
        });
    });

    describe("mathAverageRate", () => {
        it("should find the average difference from a list of sequential numbers", () => {
            // Arrange
            const numbers = [1, 3, 5, 8, 13];
            const expected = 3;
            // Act
            const actual = mathAverageRate(numbers);
            // Assert
            expect(actual).toBeCloseTo(expected, 4);
        });

        it("should find the average difference from a list of non-sequential numbers", () => {
            // Arrange
            const numbers = [3, 1, 5, 13, 8];
            const expected = 1.25;
            // Act
            const actual = mathAverageRate(numbers);
            // Assert
            expect(actual).toBeCloseTo(expected, 4);
        });
    });

    describe("mathAverageVariance", () => {
        it("(1) should find the variance of an average of numbers", () => {
            // Arrange
            const numbers = [5, 5, 5, 5, 5];
            const expected = 0;
            // Act
            const actual = mathAverageVariance(numbers);
            // Assert
            expect(actual).toBeCloseTo(expected, 4);
        });

        it("(2) should find the variance of an average of numbers", () => {
            // Arrange
            const numbers = [5, 5, 10, 5, 5];
            const expected = 1.6;
            // Act
            const actual = mathAverageVariance(numbers);
            // Assert
            expect(actual).toBeCloseTo(expected, 4);
        });

        it("(3) should find the variance of an average of numbers", () => {
            // Arrange
            const numbers = [10, 10, 0, 10, 10];
            const expected = 3.2;
            // Act
            const actual = mathAverageVariance(numbers);
            // Assert
            expect(actual).toBeCloseTo(expected, 4);
        });

        it("(4) should find the variance of an average of numbers", () => {
            // Arrange
            const numbers = [10, 10, 10, 9, 10];
            const expected = 0.32;
            // Act
            const actual = mathAverageVariance(numbers);
            // Assert
            expect(actual).toBeCloseTo(expected, 4);
        });
    });
});
