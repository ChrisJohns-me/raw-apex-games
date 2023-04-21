import { isEmpty, parseBoolean } from "./boolean.js";

describe("BooleanUtilities", () => {
    describe("parseBoolean", () => {
        //#region boolean
        it("should return true by parsing true", () => {
            const actual = parseBoolean(true);
            expect(actual).toBeTrue();
        });

        it("should return false by parsing false", () => {
            const actual = parseBoolean(false);
            expect(actual).toBeFalse();
        });
        //#endregion

        //#region string
        it("should return false by parsing ''", () => {
            const actual = parseBoolean("");
            expect(actual).toBeFalse();
        });

        it("should return true by parsing 'true'", () => {
            const actual = parseBoolean("true");
            expect(actual).toBeTrue();
        });

        it("should return false by parsing 'false'", () => {
            const actual = parseBoolean("false");
            expect(actual).toBeFalse();
        });

        it("should return true by parsing 'TRUE'", () => {
            const actual = parseBoolean("TRUE");
            expect(actual).toBeTrue();
        });

        it("should return false by parsing 'FALSE'", () => {
            const actual = parseBoolean("FALSE");
            expect(actual).toBeFalse();
        });

        it("should return true by parsing ' true '", () => {
            const actual = parseBoolean(" true ");
            expect(actual).toBeTrue();
        });

        it("should return false by parsing ' false '", () => {
            const actual = parseBoolean(" false ");
            expect(actual).toBeFalse();
        });
        //#endregion

        //#region Coercion
        it("should return true by parsing 1", () => {
            const actual = parseBoolean(1);
            expect(actual).toBeTrue();
        });

        it("should return false by parsing 0", () => {
            const actual = parseBoolean(0);
            expect(actual).toBeFalse();
        });
        //#endregion
    });

    describe("isEmpty", () => {
        //#region True cases
        it("should return true for empty string", () => {
            const actual = isEmpty("");
            expect(actual).toBeTrue();
        });

        it("should return true for empty string (with space)", () => {
            const actual = isEmpty(" ");
            expect(actual).toBeTrue();
        });

        it("should return true for empty object", () => {
            const actual = isEmpty({});
            expect(actual).toBeTrue();
        });

        it("should return true for empty array", () => {
            const actual = isEmpty([]);
            expect(actual).toBeTrue();
        });

        it("should return true for null", () => {
            const actual = isEmpty(null);
            expect(actual).toBeTrue();
        });

        it("should return true for undefined", () => {
            const actual = isEmpty(undefined);
            expect(actual).toBeTrue();
        });

        it("should return true for NaN", () => {
            const actual = isEmpty(NaN);
            expect(actual).toBeTrue();
        });
        //#endregion

        //#region False cases
        it("should return false for non-empty object", () => {
            const actual = isEmpty({ empty: false });
            expect(actual).toBeFalse();
        });

        it("should return false for non-empty array", () => {
            const actual = isEmpty(["non-empty"]);
            expect(actual).toBeFalse();
        });

        it("should return false for non-empty string", () => {
            const actual = isEmpty("non-empty");
            expect(actual).toBeFalse();
        });

        it("should return false for number zero", () => {
            const actual = isEmpty(0);
            expect(actual).toBeFalse();
        });

        it("should return false for negative numbers", () => {
            const actual = isEmpty(-123);
            expect(actual).toBeFalse();
        });

        it("should return false for positive numbers", () => {
            const actual = isEmpty(123);
            expect(actual).toBeFalse();
        });

        it("should return false for negative Infinity", () => {
            const actual = isEmpty(-Infinity);
            expect(actual).toBeFalse();
        });

        it("should return false for positive Infinity", () => {
            const actual = isEmpty(Infinity);
            expect(actual).toBeFalse();
        });

        it("should return false for Date", () => {
            const actual = isEmpty(new Date(0));
            expect(actual).toBeFalse();
        });

        it("should return false for true boolean", () => {
            const actual = isEmpty(true);
            expect(actual).toBeFalse();
        });

        it("should return false for false boolean", () => {
            const actual = isEmpty(false);
            expect(actual).toBeFalse();
        });
        //#endregion
    });
});
