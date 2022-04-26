import { isPlayerNameEqual } from "./player";

describe("Player Utilities", () => {
    //#region isPlayerNameEqual
    it("should match exact player names", () => {
        expect(isPlayerNameEqual("lowercase", "lowercase")).withContext("lowercase").toBeTrue();
        expect(isPlayerNameEqual("UPPERCASE", "UPPERCASE")).withContext("UPPERCASE").toBeTrue();
        expect(isPlayerNameEqual("PascalCase", "PascalCase")).withContext("PascalCase").toBeTrue();
        expect(isPlayerNameEqual("Numbers_1234567890", "Numbers_1234567890")).withContext("Numbers_1234567890").toBeTrue();
        expect(isPlayerNameEqual("SpecialChars_`!@#$%^&*()-_+={}[]|\\/:;\"'<>,.", "SpecialChars_`!@#$%^&*()-_+={}[]|\\/:;\"'<>,."))
            .withContext("SpecialChars_`!@#$%^&*()-_+={}[]|\\/:;\"'<>,.")
            .toBeTrue();
        expect(isPlayerNameEqual("LanguageChars_的١", "LanguageChars_的١")).withContext("LanguageChars_的١").toBeTrue();
    });

    it("should match exact player names with clubs", () => {
        expect(isPlayerNameEqual("[ABCD] lowercase", "[ABCD] lowercase")).withContext("[ABCD] lowercase").toBeTrue();
        expect(isPlayerNameEqual("[ABCD] UPPERCASE", "[ABCD] UPPERCASE")).withContext("[ABCD] UPPERCASE").toBeTrue();
        expect(isPlayerNameEqual("[ABCD] PascalCase", "[ABCD] PascalCase")).withContext("[ABCD] PascalCase").toBeTrue();
        expect(isPlayerNameEqual("[ABCD] Numbers_1234567890", "[ABCD] Numbers_1234567890"))
            .withContext("[ABCD] Numbers_1234567890")
            .toBeTrue();
        expect(
            isPlayerNameEqual(
                "[ABCD] SpecialChars_`!@#$%^&*()-_+={}[]|\\/:;\"'<>,.",
                "[ABCD] SpecialChars_`!@#$%^&*()-_+={}[]|\\/:;\"'<>,."
            )
        )
            .withContext("[ABCD] SpecialChars_`!@#$%^&*()-_+={}[]|\\/:;\"'<>,.")
            .toBeTrue();
        expect(isPlayerNameEqual("[ABCD] LanguageChars_的١", "[ABCD] LanguageChars_的١"))
            .withContext("[ABCD] LanguageChars_的١")
            .toBeTrue();
    });

    it("should match exact player names with faux clubs", () => {
        expect(isPlayerNameEqual("[ABCD] [EFGH] lowercase", "[ABCD] [EFGH] lowercase")).withContext("[ABCD] [EFGH] lowercase").toBeTrue();
        expect(isPlayerNameEqual("[ABCD] [EFGH] UPPERCASE", "[ABCD] [EFGH] UPPERCASE")).withContext("[ABCD] [EFGH] UPPERCASE").toBeTrue();
        expect(isPlayerNameEqual("[ABCD] [EFGH] PascalCase", "[ABCD] [EFGH] PascalCase"))
            .withContext("[ABCD] [EFGH] PascalCase")
            .toBeTrue();
        expect(isPlayerNameEqual("[ABCD] [EFGH] Numbers_1234567890", "[ABCD] [EFGH] Numbers_1234567890"))
            .withContext("[ABCD] [EFGH] Numbers_1234567890")
            .toBeTrue();
        expect(
            isPlayerNameEqual(
                "[ABCD] [EFGH] SpecialChars_`!@#$%^&*()-_+={}[]|\\/:;\"'<>,.",
                "[ABCD] [EFGH] SpecialChars_`!@#$%^&*()-_+={}[]|\\/:;\"'<>,."
            )
        )
            .withContext("[ABCD] [EFGH] SpecialChars_`!@#$%^&*()-_+={}[]|\\/:;\"'<>,.")
            .toBeTrue();
        expect(isPlayerNameEqual("[ABCD] [EFGH] LanguageChars_的١", "[ABCD] [EFGH] LanguageChars_的١"))
            .withContext("[ABCD] [EFGH] LanguageChars_的١")
            .toBeTrue();
    });

    it("should match player names with missing club names", () => {
        expect(isPlayerNameEqual("[ABCD] lowercase", "lowercase")).withContext("[ABCD] lowercase").toBeTrue();
        expect(isPlayerNameEqual("[ABCD] UPPERCASE", "UPPERCASE")).withContext("[ABCD] UPPERCASE").toBeTrue();
        expect(isPlayerNameEqual("[ABCD] PascalCase", "PascalCase")).withContext("[ABCD] PascalCase").toBeTrue();
        expect(isPlayerNameEqual("[ABCD] Numbers_1234567890", "Numbers_1234567890")).withContext("[ABCD] Numbers_1234567890").toBeTrue();
        expect(isPlayerNameEqual("[ABCD] SpecialChars_`!@#$%^&*()-_+={}[]|\\/:;\"'<>,.", "SpecialChars_`!@#$%^&*()-_+={}[]|\\/:;\"'<>,."))
            .withContext("[ABCD] SpecialChars_`!@#$%^&*()-_+={}[]|\\/:;\"'<>,.")
            .toBeTrue();
        expect(isPlayerNameEqual("[ABCD] LanguageChars_的١", "LanguageChars_的١")).withContext("[ABCD] LanguageChars_的١").toBeTrue();
    });

    it("should match player names + club names with faux clubs", () => {
        expect(isPlayerNameEqual("[ABCD] [EFGH] lowercase", "[EFGH] lowercase")).withContext("[ABCD] [EFGH] lowercase").toBeTrue();
        expect(isPlayerNameEqual("[ABCD] [EFGH] UPPERCASE", "[EFGH] UPPERCASE")).withContext("[ABCD] [EFGH] UPPERCASE").toBeTrue();
        expect(isPlayerNameEqual("[ABCD] [EFGH] PascalCase", "[EFGH] PascalCase")).withContext("[ABCD] [EFGH] PascalCase").toBeTrue();
        expect(isPlayerNameEqual("[ABCD] [EFGH] Numbers_1234567890", "[EFGH] Numbers_1234567890"))
            .withContext("[ABCD] [EFGH] Numbers_1234567890")
            .toBeTrue();
        expect(
            isPlayerNameEqual(
                "[ABCD] [EFGH] SpecialChars_`!@#$%^&*()-_+={}[]|\\/:;\"'<>,.",
                "[EFGH] SpecialChars_`!@#$%^&*()-_+={}[]|\\/:;\"'<>,."
            )
        )
            .withContext("[ABCD] [EFGH] SpecialChars_`!@#$%^&*()-_+={}[]|\\/:;\"'<>,.")
            .toBeTrue();
        expect(isPlayerNameEqual("[ABCD] [EFGH] LanguageChars_的١", "[EFGH] LanguageChars_的١"))
            .withContext("[ABCD] [EFGH] LanguageChars_的١")
            .toBeTrue();
    });

    it("should match very similar player names", () => {
        expect(isPlayerNameEqual(" spaces ", "spaces")).withContext("spaces").toBeTrue();
        expect(isPlayerNameEqual("newlines\n", "newlines")).withContext("newlines").toBeTrue();
    });

    it("should player names and ignore Overwolf's mistakes", () => {
        expect(isPlayerNameEqual("`1[ABCD] Player1", "[ABCD] Player1")).withContext("`1[ABCD] Player1").toBeTrue();
        expect(isPlayerNameEqual("`1[ABCD] Player1", "Player1")).withContext("`1[ABCD] Player1").toBeTrue();
        expect(isPlayerNameEqual("`1[ABCD] Player1", " Player1 ")).withContext("`1[ABCD] Player1").toBeTrue();
    });
    //#endregion
});
