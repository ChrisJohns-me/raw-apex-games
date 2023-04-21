import { cleanFloat, cleanInt } from "./number.js";

describe("NumberUtilities", () => {
    describe("cleanInt", () => {
        it("should return number", () => {
            // Arrange / Act
            const actual = cleanInt(0);
            // Assert
            expect(actual).toBe(0);
        });

        it("should coerce '0' to number", () => {
            // Arrange / Act
            const actual = cleanInt("0");
            // Assert
            expect(actual).toBe(0);
        });

        it("should coerce '1' to number", () => {
            // Arrange / Act
            const actual = cleanInt("1");
            // Assert
            expect(actual).toBe(1);
        });

        it("should return 0 from null", () => {
            // Arrange / Act
            const actual = cleanInt(null);
            // Assert
            expect(actual).toBe(0);
        });

        it("should return 0 from undefined", () => {
            // Arrange / Act
            const actual = cleanInt(undefined);
            // Assert
            expect(actual).toBe(0);
        });

        it("should return 0 from 'string'", () => {
            // Arrange / Act
            const actual = cleanInt("string");
            // Assert
            expect(actual).toBe(0);
        });
    });

    describe("cleanFloat", () => {
        it("should return number", () => {
            // Arrange / Act
            const actual = cleanFloat(0);
            // Assert
            expect(actual).toBe(0);
        });

        it("should coerce '0.1' to number", () => {
            // Arrange / Act
            const actual = cleanFloat("0.1");
            // Assert
            expect(actual).toBe(0.1);
        });

        it("should coerce '1.1' to number", () => {
            // Arrange / Act
            const actual = cleanFloat("1.1");
            // Assert
            expect(actual).toBe(1.1);
        });

        it("should return 0 from null", () => {
            // Arrange / Act
            const actual = cleanFloat(null);
            // Assert
            expect(actual).toBe(0);
        });

        it("should return 0 from undefined", () => {
            // Arrange / Act
            const actual = cleanFloat(undefined);
            // Assert
            expect(actual).toBe(0);
        });

        it("should return 0 from 'string'", () => {
            // Arrange / Act
            const actual = cleanFloat("string");
            // Assert
            expect(actual).toBe(0);
        });
    });
});
