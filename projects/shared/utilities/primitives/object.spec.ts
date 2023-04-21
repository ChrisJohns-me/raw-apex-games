import {
    findKeyByKeyRegEx,
    findValueByKeyRegEx,
    incrementedKeysToKeyedObject,
    incrementedKeysToValueArray,
    recursiveEmptyObjectsToNull,
    recursiveEmptyStringsToNull,
    recursiveJSONParse,
    recursiveParseBoolean,
    recursiveParseNull,
} from "./object.js";

describe("ObjectUtilities", () => {
    describe("findKeyByKeyRegEx", () => {
        it("should return key from RegEx", () => {
            // Arrange / Act
            const actualKey = findKeyByKeyRegEx({ key_0: "value123" }, /^key_/);
            // Assert
            expect(actualKey).toEqual("key_0");
        });
    });

    describe("findValueByKeyRegEx", () => {
        it("should return value from RegEx", () => {
            // Arrange / Act
            const actualValue = findValueByKeyRegEx({ key_0: "value123" }, /^key_/);
            // Assert
            expect(actualValue).toEqual("value123");
        });
    });

    describe("incrementedKeysToKeyedObject", () => {
        it("should return an array of keys from RegEx", () => {
            // Arrange / Act
            const actualKey = incrementedKeysToKeyedObject<{ [key: number]: unknown }>(
                { unrelated_key: "empty", key_0: "value0", key_1: "value1", key_2: "value2" },
                /^key_(\d+)/
            );
            // Assert
            expect(actualKey).toEqual({ "0": "value0", "1": "value1", "2": "value2" });
        });
    });

    describe("incrementedKeysToValueArray", () => {
        it("should return an array of values from RegEx", () => {
            // Arrange / Act
            const actualKey = incrementedKeysToValueArray(
                { unrelated_key: "empty", key_0: "value0", key_1: "value1", key_2: "value2" },
                /^key_/
            );
            // Assert
            expect(actualKey).toEqual(["value0", "value1", "value2"]);
        });
    });

    describe("recursiveJSONParse", () => {
        it("should parse a string of JSON", () => {
            // Arrange
            const expected = { prop1: { prop2: { prop3: "val1" } } };
            // Act
            const input = `{ "prop1": { "prop2": { "prop3": "val1" } } }`;
            const actual = recursiveJSONParse(input);
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should parse an object containing strings of JSON", () => {
            // Arrange
            const expected = {
                prop1: { prop1a: "val1" },
                prop2: {
                    prop2a: {
                        prop2aa: "val2",
                    },
                },
                prop3: {
                    prop3a: {
                        prop3aa: "val2",
                    },
                },
            };
            // Act
            const input = {
                prop1: `{ "prop1a": "val1" }`,
                prop2: {
                    prop2a: `{
                        "prop2aa": "val2"
                    }`,
                },
                prop3: `{
                    "prop3a": {
                        "prop3aa": "val2"
                    }
                }`,
            };
            const actual = recursiveJSONParse(input);
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should NOT parse boolean string", () => {
            // Arrange
            const expected = { prop1: "true" };
            // Act
            const input = { prop1: "true" };
            const actual = recursiveJSONParse(input);
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should NOT parse boolean", () => {
            // Arrange
            const expected = { prop1: true };
            // Act
            const input = { prop1: true };
            const actual = recursiveJSONParse(input);
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should NOT parse ''", () => {
            // Arrange
            const expected = { prop1: "" };
            // Act
            const input = { prop1: "" };
            const actual = recursiveJSONParse(input);
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should NOT parse 'null'", () => {
            // Arrange
            const expected = { prop1: "null" };
            // Act
            const input = { prop1: "null" };
            const actual = recursiveJSONParse(input);
            // Assert
            expect(actual).toEqual(expected);
        });
    });

    describe("recursiveParseBoolean", () => {
        it("should parse 'true' to true (root)", () => {
            // Arrange
            const expected = { prop1: true };
            // Act
            const input = { prop1: "true" };
            const actual = recursiveParseBoolean(input);
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should parse 'false' to false (root)", () => {
            // Arrange
            const expected = { prop1: false };
            // Act
            const input = { prop1: "false" };
            const actual = recursiveParseBoolean(input);
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should parse 'true' to true (nested)", () => {
            // Arrange
            const expected = { prop1: { prop2: { prop3: true } } };
            // Act
            const input = { prop1: { prop2: { prop3: "true" } } };
            const actual = recursiveParseBoolean(input);
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should parse 'false' to false (nested)", () => {
            // Arrange
            const expected = { prop1: { prop2: { prop3: false } } };
            // Act
            const input = { prop1: { prop2: { prop3: "false" } } };
            const actual = recursiveParseBoolean(input);
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should NOT parse ''", () => {
            // Arrange
            const expected = { prop1: "" };
            // Act
            const input = { prop1: "" };
            const actual = recursiveParseBoolean(input);
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should NOT parse string", () => {
            // Arrange
            const expected = { prop1: "val1" };
            // Act
            const input = { prop1: "val1" };
            const actual = recursiveParseBoolean(input);
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should NOT parse '{}'", () => {
            // Arrange
            const expected = { prop1: "{}" };
            // Act
            const input = { prop1: "{}" };
            const actual = recursiveParseBoolean(input);
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should NOT parse {}", () => {
            // Arrange
            const expected = { prop1: {} };
            // Act
            const input = { prop1: {} };
            const actual = recursiveParseBoolean(input);
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should NOT parse 'null'", () => {
            // Arrange
            const expected = { prop1: "null" };
            // Act
            const input = { prop1: "null" };
            const actual = recursiveParseBoolean(input);
            // Assert
            expect(actual).toEqual(expected);
        });
    });

    describe("recursiveParseNull", () => {
        it("should parse 'null' to null (root)", () => {
            // Arrange
            const expected = { prop1: null };
            // Act
            const input = { prop1: "null" };
            const actual = recursiveParseNull(input);
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should parse 'undefined' to null (root)", () => {
            // Arrange
            const expected = { prop1: null };
            // Act
            const input = { prop1: "undefined" };
            const actual = recursiveParseNull(input);
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should parse 'null' to null (nested)", () => {
            // Arrange
            const expected = { prop1: { prop2: { prop3: null } } };
            // Act
            const input = { prop1: { prop2: { prop3: "null" } } };
            const actual = recursiveParseNull(input);
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should parse 'undefined' to null (nested)", () => {
            // Arrange
            const expected = { prop1: { prop2: { prop3: null } } };
            // Act
            const input = { prop1: { prop2: { prop3: "undefined" } } };
            const actual = recursiveParseNull(input);
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should NOT parse string", () => {
            // Arrange
            const expected = { prop1: "val1" };
            // Act
            const input = { prop1: "val1" };
            const actual = recursiveParseNull(input);
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should NOT parse boolean string", () => {
            // Arrange
            const expected = { prop1: "true" };
            // Act
            const input = { prop1: "true" };
            const actual = recursiveParseNull(input);
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should NOT parse boolean", () => {
            // Arrange
            const expected = { prop1: true };
            // Act
            const input = { prop1: true };
            const actual = recursiveParseNull(input);
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should NOT parse '{}'", () => {
            // Arrange
            const expected = { prop1: "{}" };
            // Act
            const input = { prop1: "{}" };
            const actual = recursiveParseNull(input);
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should NOT parse {}", () => {
            // Arrange
            const expected = { prop1: {} };
            // Act
            const input = { prop1: {} };
            const actual = recursiveParseNull(input);
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should NOT parse ''", () => {
            // Arrange
            const expected = { prop1: "" };
            // Act
            const input = { prop1: "" };
            const actual = recursiveParseNull(input);
            // Assert
            expect(actual).toEqual(expected);
        });
    });

    describe("recursiveEmptyObjectsToNull", () => {
        it("should parse {} to null (root)", () => {
            // Arrange
            const expected = { prop1: null };
            // Act
            const input = { prop1: {} };
            const actual = recursiveEmptyObjectsToNull(input);
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should parse {} to null (nested)", () => {
            // Arrange
            const expected = { prop1: { prop2: { prop3: null } } };
            // Act
            const input = { prop1: { prop2: { prop3: {} } } };
            const actual = recursiveEmptyObjectsToNull(input);
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should NOT parse ''", () => {
            // Arrange
            const expected = { prop1: "" };
            // Act
            const input = { prop1: "" };
            const actual = recursiveEmptyObjectsToNull(input);
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should NOT parse string", () => {
            // Arrange
            const expected = { prop1: "val1" };
            // Act
            const input = { prop1: "val1" };
            const actual = recursiveEmptyObjectsToNull(input);
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should NOT parse boolean string", () => {
            // Arrange
            const expected = { prop1: "true" };
            // Act
            const input = { prop1: "true" };
            const actual = recursiveEmptyObjectsToNull(input);
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should NOT parse boolean", () => {
            // Arrange
            const expected = { prop1: true };
            // Act
            const input = { prop1: true };
            const actual = recursiveEmptyObjectsToNull(input);
            // Assert
            expect(actual).toEqual(expected);
        });
    });

    describe("recursiveEmptyStringsToNull", () => {
        it("should parse '' to null (root)", () => {
            // Arrange
            const expected = { prop1: null };
            // Act
            const input = { prop1: "" };
            const actual = recursiveEmptyStringsToNull(input);
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should parse '' to null (nested)", () => {
            // Arrange
            const expected = { prop1: { prop2: { prop3: null } } };
            // Act
            const input = { prop1: { prop2: { prop3: "" } } };
            const actual = recursiveEmptyStringsToNull(input);
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should NOT parse string", () => {
            // Arrange
            const expected = { prop1: "val1" };
            // Act
            const input = { prop1: "val1" };
            const actual = recursiveEmptyStringsToNull(input);
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should NOT parse boolean string", () => {
            // Arrange
            const expected = { prop1: "true" };
            // Act
            const input = { prop1: "true" };
            const actual = recursiveEmptyStringsToNull(input);
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should NOT parse boolean", () => {
            // Arrange
            const expected = { prop1: true };
            // Act
            const input = { prop1: true };
            const actual = recursiveEmptyStringsToNull(input);
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should NOT parse '{}'", () => {
            // Arrange
            const expected = { prop1: "{}" };
            // Act
            const input = { prop1: "{}" };
            const actual = recursiveEmptyStringsToNull(input);
            // Assert
            expect(actual).toEqual(expected);
        });

        it("should NOT parse {}", () => {
            // Arrange
            const expected = { prop1: {} };
            // Act
            const input = { prop1: {} };
            const actual = recursiveEmptyStringsToNull(input);
            // Assert
            expect(actual).toEqual(expected);
        });
    });
});
