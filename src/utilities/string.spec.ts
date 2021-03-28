import { wordsToUpperCase } from "./string";

describe("StringUtilities", () => {
    describe("wordsToUpperCase", () => {
        it("should return first word uppercased", () => {
            const expected = "Uppercased";
            const actual = wordsToUpperCase("uppercased");
            expect(actual).toBe(expected);
        });

        it("should return second word uppercased", () => {
            const expected = "Uppercased Word";
            const actual = wordsToUpperCase("uppercased word");
            expect(actual).toBe(expected);
        });
    });
});
