import { mathClamp } from "./math";

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
});
