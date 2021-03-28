import { cleanFloat, cleanInt } from "./number";

describe("NumberUtilities", () => {
    describe("cleanInt", () => {
        it("should return number", () => {
            const actual = cleanInt(0);
            expect(actual).toBe(0);
        });

        it("should coerce '0' to number", () => {
            const actual = cleanInt("0");
            expect(actual).toBe(0);
        });

        it("should coerce '1' to number", () => {
            const actual = cleanInt("1");
            expect(actual).toBe(1);
        });

        it("should return 0 from null", () => {
            const actual = cleanInt(null);
            expect(actual).toBe(0);
        });

        it("should return 0 from undefined", () => {
            const actual = cleanInt(undefined);
            expect(actual).toBe(0);
        });

        it("should return 0 from 'string'", () => {
            const actual = cleanInt("string");
            expect(actual).toBe(0);
        });
    });

    describe("cleanFloat", () => {
        it("should return number", () => {
            const actual = cleanFloat(0);
            expect(actual).toBe(0);
        });

        it("should coerce '0.1' to number", () => {
            const actual = cleanFloat("0.1");
            expect(actual).toBe(0.1);
        });

        it("should coerce '1.1' to number", () => {
            const actual = cleanFloat("1.1");
            expect(actual).toBe(1.1);
        });

        it("should return 0 from null", () => {
            const actual = cleanFloat(null);
            expect(actual).toBe(0);
        });

        it("should return 0 from undefined", () => {
            const actual = cleanFloat(undefined);
            expect(actual).toBe(0);
        });

        it("should return 0 from 'string'", () => {
            const actual = cleanFloat("string");
            expect(actual).toBe(0);
        });
    });
});
