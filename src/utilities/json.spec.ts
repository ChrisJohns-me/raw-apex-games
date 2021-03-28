import { JSONTryParse, recursiveJSONParse } from "./json";

describe("JSONUtilities", () => {
    describe("JSONTryParse", () => {
        it("should parse valid JSON", () => {
            const expected = { property: "value" };
            const actual = JSONTryParse(`{"property": "value"}`);
            expect(actual).toEqual(expected);
        });

        it("should return undefined from invalid JSON", () => {
            const actual = JSONTryParse(`{invalid data}`);
            expect(actual).toBeUndefined();
        });
    });

    describe("recursiveJSONParse", () => {
        //#region string
        it("should parse string prop (root)", () => {
            const expected = { prop1: "val1" };
            const actual = recursiveJSONParse({ prop1: "val1" });
            expect(actual).toEqual(expected);
        });

        it("should parse string prop (1 level deep)", () => {
            const expected = { prop1: { prop2: "val1" } };
            const actual = recursiveJSONParse({ prop1: { prop2: "val1" } });
            expect(actual).toEqual(expected);
        });

        it("should parse string prop (2 level deep)", () => {
            const expected = { prop1: { prop2: { prop3: "val1" } } };
            const actual = recursiveJSONParse({ prop1: { prop2: { prop3: "val1" } } });
            expect(actual).toEqual(expected);
        });
        //#endregion

        //#region boolean
        it("should parse true string prop (root)", () => {
            const expected = { prop1: true };
            const actual = recursiveJSONParse({ prop1: "true" });
            expect(actual).toEqual(expected);
        });

        it("should parse true string prop (1 level deep)", () => {
            const expected = { prop1: { prop2: true } };
            const actual = recursiveJSONParse({ prop1: { prop2: "true" } });
            expect(actual).toEqual(expected);
        });

        it("should parse true string prop (2 level deep)", () => {
            const expected = { prop1: { prop2: { prop3: true } } };
            const actual = recursiveJSONParse({ prop1: { prop2: { prop3: "true" } } });
            expect(actual).toEqual(expected);
        });

        it("should parse false string prop (root)", () => {
            const expected = { prop1: false };
            const actual = recursiveJSONParse({ prop1: "false" });
            expect(actual).toEqual(expected);
        });

        it("should parse false string prop (1 level deep)", () => {
            const expected = { prop1: { prop2: false } };
            const actual = recursiveJSONParse({ prop1: { prop2: "false" } });
            expect(actual).toEqual(expected);
        });

        it("should parse false string prop (2 level deep)", () => {
            const expected = { prop1: { prop2: { prop3: false } } };
            const actual = recursiveJSONParse({ prop1: { prop2: { prop3: "false" } } });
            expect(actual).toEqual(expected);
        });
        //#endregion

        //#region null/undefined
        it("should parse null string prop (root)", () => {
            const expected = { prop1: null };
            const actual = recursiveJSONParse({ prop1: "null" });
            expect(actual).toEqual(expected);
        });

        it("should parse null string prop (1 level deep)", () => {
            const expected = { prop1: { prop2: null } };
            const actual = recursiveJSONParse({ prop1: { prop2: "null" } });
            expect(actual).toEqual(expected);
        });

        it("should parse null string prop (2 level deep)", () => {
            const expected = { prop1: { prop2: { prop3: null } } };
            const actual = recursiveJSONParse({ prop1: { prop2: { prop3: "null" } } });
            expect(actual).toEqual(expected);
        });

        it("should parse undefined string prop to null (root)", () => {
            const expected = { prop1: null };
            const actual = recursiveJSONParse({ prop1: "undefined" });
            expect(actual).toEqual(expected);
        });

        it("should parse undefined string prop to null (1 level deep)", () => {
            const expected = { prop1: { prop2: null } };
            const actual = recursiveJSONParse({ prop1: { prop2: "undefined" } });
            expect(actual).toEqual(expected);
        });

        it("should parse undefined string prop to null (2 level deep)", () => {
            const expected = { prop1: { prop2: { prop3: null } } };
            const actual = recursiveJSONParse({ prop1: { prop2: { prop3: "undefined" } } });
            expect(actual).toEqual(expected);
        });
        //#endregion
    });
});
