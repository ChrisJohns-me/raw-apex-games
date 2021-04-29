import { unique } from "./array";

describe("ArrayUtilities", () => {
    describe("unique", () => {
        //#region primitives
        it("should return a unique array of strings", () => {
            // Arrange
            const strings = ["d", "c", "b", "c", "d", "a", "d", "d", "c", "b"];

            // Act
            const actual = unique(strings).sort();

            // Assert
            const expected = ["a", "b", "c", "d"];
            expect(actual).toEqual(expected);
        });

        it("should return a unique array of numbers", () => {
            // Arrange
            const numbers = [3, 2, 1, 2, 3, 0, 3, 3, 2, 1];

            // Act
            const actual = unique(numbers).sort();

            // Assert
            const expected = [0, 1, 2, 3];
            expect(actual).toEqual(expected);
        });

        it("should return a unique array of numbers and strings", () => {
            // Arrange
            const mix = [3, "d", 2, "c", 1, "b", 2, "c", 3, "d", 0, "a", 3, "d", 3, "d", 2, "c", 1, "b"];

            // Act
            const actual = unique(mix).sort();

            // Assert
            const expected = [0, 1, 2, 3, "a", "b", "c", "d"];
            expect(actual).toEqual(expected);
        });
        //#endregion
    });
});
