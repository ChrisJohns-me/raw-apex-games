import { JSONTryParse } from "./json.js";

describe("JSONUtilities", () => {
    describe("JSONTryParse", () => {
        it("should parse valid JSON", () => {
            // Arrange
            const expected = { property: "value" };
            // Act
            const actual = JSONTryParse(`{"property": "value"}`);
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should return undefined from invalid JSON", () => {
            // Arrange / Act
            const actual = JSONTryParse(`{invalid data}`);
            // Assert
            expect(actual).toBeUndefined();
        });
    });
});
