import { JSONTryParse, recursiveJSONParse } from "./json";

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

    describe("recursiveJSONParse", () => {
        //#region string
        it("should parse string prop (root)", () => {
            // Arrange
            const expected = { prop1: "val1" };
            // Act
            const actual = recursiveJSONParse({ prop1: "val1" });
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should parse string prop (1 level deep)", () => {
            // Arrange
            const expected = { prop1: { prop2: "val1" } };
            // Act
            const actual = recursiveJSONParse({ prop1: { prop2: "val1" } });
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should parse string prop (2 level deep)", () => {
            // Arrange
            const expected = { prop1: { prop2: { prop3: "val1" } } };
            // Act
            const actual = recursiveJSONParse({ prop1: { prop2: { prop3: "val1" } } });
            // Assert
            expect(actual).toEqual(expected);
        });
        //#endregion

        //#region boolean
        it("should parse true string prop (root)", () => {
            // Arrange
            const expected = { prop1: true };
            // Act
            const actual = recursiveJSONParse({ prop1: "true" });
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should parse true string prop (1 level deep)", () => {
            // Arrange
            const expected = { prop1: { prop2: true } };
            // Act
            const actual = recursiveJSONParse({ prop1: { prop2: "true" } });
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should parse true string prop (2 level deep)", () => {
            // Arrange
            const expected = { prop1: { prop2: { prop3: true } } };
            // Act
            const actual = recursiveJSONParse({ prop1: { prop2: { prop3: "true" } } });
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should parse false string prop (root)", () => {
            // Arrange
            const expected = { prop1: false };
            // Act
            const actual = recursiveJSONParse({ prop1: "false" });
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should parse false string prop (1 level deep)", () => {
            // Arrange
            const expected = { prop1: { prop2: false } };
            // Act
            const actual = recursiveJSONParse({ prop1: { prop2: "false" } });
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should parse false string prop (2 level deep)", () => {
            // Arrange
            const expected = { prop1: { prop2: { prop3: false } } };
            // Act
            const actual = recursiveJSONParse({ prop1: { prop2: { prop3: "false" } } });
            // Assert
            expect(actual).toEqual(expected);
        });
        //#endregion

        //#region null/undefined
        it("should parse null string prop (root)", () => {
            // Arrange
            const expected = { prop1: null };
            // Act
            const actual = recursiveJSONParse({ prop1: "null" });
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should parse null string prop (1 level deep)", () => {
            // Arrange
            const expected = { prop1: { prop2: null } };
            // Act
            const actual = recursiveJSONParse({ prop1: { prop2: "null" } });
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should parse null string prop (2 level deep)", () => {
            // Arrange
            const expected = { prop1: { prop2: { prop3: null } } };
            // Act
            const actual = recursiveJSONParse({ prop1: { prop2: { prop3: "null" } } });
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should parse undefined string prop to null (root)", () => {
            // Arrange
            const expected = { prop1: null };
            // Act
            const actual = recursiveJSONParse({ prop1: "undefined" });
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should parse undefined string prop to null (1 level deep)", () => {
            // Arrange
            const expected = { prop1: { prop2: null } };
            // Act
            const actual = recursiveJSONParse({ prop1: { prop2: "undefined" } });
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should parse undefined string prop to null (2 level deep)", () => {
            // Arrange
            const expected = { prop1: { prop2: { prop3: null } } };
            // Act
            const actual = recursiveJSONParse({ prop1: { prop2: { prop3: "undefined" } } });
            // Assert
            expect(actual).toEqual(expected);
        });
        //#endregion
    });
});
