import { hexToRgb } from "./color";

// TODO....
describe("ColorUtilities", () => {
    describe("hexToRgb", () => {
        it("should return white", () => {
            // Arrange / Act
            const actual = hexToRgb("#fff");

            // Assert
            const expected = [255, 255, 255];
            expect(actual).toEqual(expected);
        });

        it("should return black", () => {
            // Arrange / Act
            const actual = hexToRgb("#000000");

            // Assert
            const expected = [0, 0, 0];
            expect(actual).toEqual(expected);
        });
        it("should return red", () => {
            // Arrange / Act
            const actual = hexToRgb("#ff0000");

            // Assert
            const expected = [255, 0, 0];
            expect(actual).toEqual(expected);
        });

        it("should return green", () => {
            // Arrange / Act
            const actual = hexToRgb("#00ff00");

            // Assert
            const expected = [0, 255, 0];
            expect(actual).toEqual(expected);
        });

        it("should return blue", () => {
            // Arrange / Act
            const actual = hexToRgb("#0000ff");

            // Assert
            const expected = [0, 0, 255];
            expect(actual).toEqual(expected);
        });
    });

    describe("rgbToHsl", () => {});

    describe("hslToRgb", () => {});

    describe("rgbToHsv", () => {});

    describe("hsvToRgb", () => {});
});
