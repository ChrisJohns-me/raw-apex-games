import { wordsToUpperCase } from "./string.js";

describe("StringUtilities", () => {
    describe("wordsToUpperCase", () => {
        it("should return first word uppercased", () => {
            // Arrange
            const expected = "Uppercased";
            // Act
            const actual = wordsToUpperCase("uppercased");
            // Assert
            expect(actual).toBe(expected);
        });

        it("should return second word uppercased", () => {
            // Arrange
            const expected = "Uppercased Word";
            // Act
            const actual = wordsToUpperCase("uppercased word");
            // Assert
            expect(actual).toBe(expected);
        });
    });
});
