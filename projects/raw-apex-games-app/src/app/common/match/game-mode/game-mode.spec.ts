import { addDays, subDays } from "date-fns";
import { supressConsoleLog } from "../../testing-helpers";
import { MatchGameMode } from "./game-mode";
import { MatchGameModeFriendlyName, MatchGameModeGenericId } from "./game-mode.enum";

describe("MatchGameMode", () => {
    describe("isActive", () => {
        beforeEach(() => {
            supressConsoleLog();
            jasmine.clock().uninstall();
            jasmine.clock().install();
        });

        it("should return true if the current date is between game mode's activeDates", () => {
            // Arrange
            const fakeNow = new Date("2020-01-01T00:00:00");
            const sut = new MatchGameMode({
                gameModeId: "#PL_TRAINING",
                gameModeGenericId: MatchGameModeGenericId.Training,
                gameModeName: MatchGameModeFriendlyName.Training,
                gameModeIdRegExPattern: "training",
                isReportable: false,
                isBattleRoyaleGameMode: false,
                isArenasGameMode: false,
                isControlGameMode: false,
                activeDates: [
                    {
                        from: subDays(fakeNow, 400),
                        to: subDays(fakeNow, 350),
                    },
                    {
                        from: subDays(fakeNow, 300),
                        to: subDays(fakeNow, 250),
                    },
                    {
                        from: subDays(fakeNow, 200),
                        to: subDays(fakeNow, 150),
                    },
                    {
                        from: subDays(fakeNow, 14),
                        to: addDays(fakeNow, 14),
                    },
                ],
            });

            // Act
            jasmine.clock().mockDate(fakeNow);

            // Assert
            expect(sut.isActive).toBe(true);
        });

        it("should return true if the 'to' active date is undefined", () => {
            // Arrange
            const fakeNow = new Date("2020-01-01T00:00:00");
            const sut = new MatchGameMode({
                gameModeId: "#PL_TRAINING",
                gameModeGenericId: MatchGameModeGenericId.Training,
                gameModeName: MatchGameModeFriendlyName.Training,
                gameModeIdRegExPattern: "training",
                isReportable: false,
                isBattleRoyaleGameMode: false,
                isArenasGameMode: false,
                isControlGameMode: false,
                activeDates: [
                    {
                        from: subDays(fakeNow, 400),
                        to: subDays(fakeNow, 350),
                    },
                    {
                        from: subDays(fakeNow, 300),
                        to: subDays(fakeNow, 250),
                    },
                    {
                        from: subDays(fakeNow, 200),
                        to: subDays(fakeNow, 150),
                    },
                    {
                        from: subDays(fakeNow, 14),
                    },
                ],
            });

            // Act
            jasmine.clock().mockDate(fakeNow);

            // Assert
            expect(sut.isActive).toBe(true);
        });

        it("should return false if current date is not between any activeDates", () => {
            // Arrange
            const fakeNow = new Date("2020-01-01T00:00:00");
            const sut = new MatchGameMode({
                gameModeId: "#PL_TRAINING",
                gameModeGenericId: MatchGameModeGenericId.Training,
                gameModeName: MatchGameModeFriendlyName.Training,
                gameModeIdRegExPattern: "training",
                isReportable: false,
                isBattleRoyaleGameMode: false,
                isArenasGameMode: false,
                isControlGameMode: false,
                activeDates: [
                    {
                        from: subDays(fakeNow, 400),
                        to: subDays(fakeNow, 350),
                    },
                    {
                        from: subDays(fakeNow, 300),
                        to: subDays(fakeNow, 250),
                    },
                    {
                        from: subDays(fakeNow, 200),
                        to: subDays(fakeNow, 150),
                    },
                ],
            });

            // Act
            jasmine.clock().mockDate(fakeNow);

            // Assert
            expect(sut.isActive).toBe(false);
        });
    });
});
