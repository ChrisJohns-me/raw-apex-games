import { ArenasScoreboard } from "./arenas-scoreboard";

describe("ArenasScoreboard", () => {
    it("should be create empty scoreboard", () => {
        // Arrange / Act
        const scoreboard = new ArenasScoreboard();

        // Assert
        expect(scoreboard.isUnfinished).toBe(true);
        expect(scoreboard.roundsResult).toEqual([]);
        expect(scoreboard.isWinAtRisk).toBe(false);
        expect(scoreboard.isSuddenDeath).toBe(false);
        expect(scoreboard.isLoseAtRisk).toBe(false);
        expect(scoreboard.hasLost).toBe(false);
        expect(scoreboard.hasWon).toBe(false);
        expect(scoreboard.numRoundsPlayed).toBe(0);
        expect(scoreboard.numRoundsWon).toBe(0);
        expect(scoreboard.numRoundsLost).toBe(0);
        expect(scoreboard.numRoundsWinVariance).toBe(0);
        expect(scoreboard.placement).toBe(1);
    });

    //#region Win Round Conditions
    it("should properly reflect: 1 win, 0 losses", () => {
        // Arrange
        const scoreboard = new ArenasScoreboard();

        // Act
        scoreboard.addRoundResult(true);

        // Assert
        expect(scoreboard.isUnfinished).withContext("isUnfinished").toBe(true);
        expect(scoreboard.roundsResult).withContext("roundsResult").toEqual([true]);
        expect(scoreboard.isSuddenDeath).withContext("isSuddenDeath").toBe(false);
        expect(scoreboard.isLoseAtRisk).withContext("isLoseAtRisk").toBe(false);
        expect(scoreboard.isWinAtRisk).withContext("isWinAtRisk").toBe(false);
        expect(scoreboard.hasLost).withContext("hasLost").toBe(false);
        expect(scoreboard.hasWon).withContext("hasWon").toBe(false);
        expect(scoreboard.numRoundsPlayed).withContext("numRounds").toBe(1);
        expect(scoreboard.numRoundsWon).withContext("numRoundsWon").toBe(1);
        expect(scoreboard.numRoundsLost).withContext("numRoundsLost").toBe(0);
        expect(scoreboard.numRoundsWinVariance).withContext("numRoundsWinVariance").toBe(1);
        expect(scoreboard.placement).withContext("placement").toBe(1);
    });

    it("should properly reflect: 2 wins, 0 losses", () => {
        // Arrange
        const scoreboard = new ArenasScoreboard();

        // Act
        scoreboard.addRoundResult(true);
        scoreboard.addRoundResult(true);

        // Assert
        expect(scoreboard.isUnfinished).withContext("isUnfinished").toBe(true);
        expect(scoreboard.roundsResult).withContext("roundsResult").toEqual([true, true]);
        expect(scoreboard.isSuddenDeath).withContext("isSuddenDeath").toBe(false);
        expect(scoreboard.isLoseAtRisk).withContext("isLoseAtRisk").toBe(false);
        expect(scoreboard.isWinAtRisk).withContext("isWinAtRisk").toBe(true);
        expect(scoreboard.hasLost).withContext("hasLost").toBe(false);
        expect(scoreboard.hasWon).withContext("hasWon").toBe(false);
        expect(scoreboard.numRoundsPlayed).withContext("numRounds").toBe(2);
        expect(scoreboard.numRoundsWon).withContext("numRoundsWon").toBe(2);
        expect(scoreboard.numRoundsLost).withContext("numRoundsLost").toBe(0);
        expect(scoreboard.numRoundsWinVariance).withContext("numRoundsWinVariance").toBe(2);
        expect(scoreboard.placement).withContext("placement").toBe(1);
    });
    //#endregion

    //#region Lose Round Conditions
    it("should properly reflect: 0 win, 1 losses", () => {
        // Arrange
        const scoreboard = new ArenasScoreboard();

        // Act
        scoreboard.addRoundResult(false);

        // Assert
        expect(scoreboard.isUnfinished).withContext("isUnfinished").toBe(true);
        expect(scoreboard.roundsResult).withContext("roundsResult").toEqual([false]);
        expect(scoreboard.isSuddenDeath).withContext("isSuddenDeath").toBe(false);
        expect(scoreboard.isLoseAtRisk).withContext("isLoseAtRisk").toBe(false);
        expect(scoreboard.isWinAtRisk).withContext("isWinAtRisk").toBe(false);
        expect(scoreboard.hasLost).withContext("hasLost").toBe(false);
        expect(scoreboard.hasWon).withContext("hasWon").toBe(false);
        expect(scoreboard.numRoundsPlayed).withContext("numRounds").toBe(1);
        expect(scoreboard.numRoundsWon).withContext("numRoundsWon").toBe(0);
        expect(scoreboard.numRoundsLost).withContext("numRoundsLost").toBe(1);
        expect(scoreboard.numRoundsWinVariance).withContext("numRoundsWinVariance").toBe(-1);
        expect(scoreboard.placement).withContext("placement").toBe(2);
    });

    it("should properly reflect: 0 wins, 2 losses", () => {
        // Arrange
        const scoreboard = new ArenasScoreboard();

        // Act
        scoreboard.addRoundResult(false);
        scoreboard.addRoundResult(false);

        // Assert
        expect(scoreboard.isUnfinished).withContext("isUnfinished").toBe(true);
        expect(scoreboard.roundsResult).withContext("roundsResult").toEqual([false, false]);
        expect(scoreboard.isSuddenDeath).withContext("isSuddenDeath").toBe(false);
        expect(scoreboard.isLoseAtRisk).withContext("isLoseAtRisk").toBe(true);
        expect(scoreboard.isWinAtRisk).withContext("isWinAtRisk").toBe(false);
        expect(scoreboard.hasLost).withContext("hasLost").toBe(false);
        expect(scoreboard.hasWon).withContext("hasWon").toBe(false);
        expect(scoreboard.numRoundsPlayed).withContext("numRounds").toBe(2);
        expect(scoreboard.numRoundsWon).withContext("numRoundsWon").toBe(0);
        expect(scoreboard.numRoundsLost).withContext("numRoundsLost").toBe(2);
        expect(scoreboard.numRoundsWinVariance).withContext("numRoundsWinVariance").toBe(-2);
        expect(scoreboard.placement).withContext("placement").toBe(2);
    });
    //#endregion

    //#region Tie Round Conditions
    it("should properly reflect: 1 wins, 1 losses", () => {
        // Arrange
        const scoreboard = new ArenasScoreboard();

        // Act
        scoreboard.addRoundResult(true);
        scoreboard.addRoundResult(false);

        // Assert
        expect(scoreboard.isUnfinished).withContext("isUnfinished").toBe(true);
        expect(scoreboard.roundsResult).withContext("roundsResult").toEqual([true, false]);
        expect(scoreboard.isSuddenDeath).withContext("isSuddenDeath").toBe(false);
        expect(scoreboard.isLoseAtRisk).withContext("isLoseAtRisk").toBe(false);
        expect(scoreboard.isWinAtRisk).withContext("isWinAtRisk").toBe(false);
        expect(scoreboard.hasLost).withContext("hasLost").toBe(false);
        expect(scoreboard.hasWon).withContext("hasWon").toBe(false);
        expect(scoreboard.numRoundsPlayed).withContext("numRounds").toBe(2);
        expect(scoreboard.numRoundsWon).withContext("numRoundsWon").toBe(1);
        expect(scoreboard.numRoundsLost).withContext("numRoundsLost").toBe(1);
        expect(scoreboard.numRoundsWinVariance).withContext("numRoundsWinVariance").toBe(0);
        expect(scoreboard.placement).withContext("placement").toBe(1);
    });

    it("should properly reflect: 2 wins, 2 losses", () => {
        // Arrange
        const scoreboard = new ArenasScoreboard();

        // Act
        scoreboard.addRoundResult(true);
        scoreboard.addRoundResult(false);
        scoreboard.addRoundResult(true);
        scoreboard.addRoundResult(false);

        // Assert
        expect(scoreboard.isUnfinished).withContext("isUnfinished").toBe(true);
        expect(scoreboard.roundsResult).withContext("roundsResult").toEqual([true, false, true, false]);
        expect(scoreboard.isSuddenDeath).withContext("isSuddenDeath").toBe(false);
        expect(scoreboard.isLoseAtRisk).withContext("isLoseAtRisk").toBe(false);
        expect(scoreboard.isWinAtRisk).withContext("isWinAtRisk").toBe(false);
        expect(scoreboard.hasLost).withContext("hasLost").toBe(false);
        expect(scoreboard.hasWon).withContext("hasWon").toBe(false);
        expect(scoreboard.numRoundsPlayed).withContext("numRounds").toBe(4);
        expect(scoreboard.numRoundsWon).withContext("numRoundsWon").toBe(2);
        expect(scoreboard.numRoundsLost).withContext("numRoundsLost").toBe(2);
        expect(scoreboard.numRoundsWinVariance).withContext("numRoundsWinVariance").toBe(0);
        expect(scoreboard.placement).withContext("placement").toBe(1);
    });

    it("should properly reflect: 3 wins, 3 losses", () => {
        // Arrange
        const scoreboard = new ArenasScoreboard();

        // Act
        scoreboard.addRoundResult(true);
        scoreboard.addRoundResult(false);
        scoreboard.addRoundResult(true);
        scoreboard.addRoundResult(false);
        scoreboard.addRoundResult(true);
        scoreboard.addRoundResult(false);

        // Assert
        expect(scoreboard.isUnfinished).withContext("isUnfinished").toBe(true);
        expect(scoreboard.roundsResult).withContext("roundsResult").toEqual([true, false, true, false, true, false]);
        expect(scoreboard.isSuddenDeath).withContext("isSuddenDeath").toBe(false);
        expect(scoreboard.isLoseAtRisk).withContext("isLoseAtRisk").toBe(false);
        expect(scoreboard.isWinAtRisk).withContext("isWinAtRisk").toBe(false);
        expect(scoreboard.hasLost).withContext("hasLost").toBe(false);
        expect(scoreboard.hasWon).withContext("hasWon").toBe(false);
        expect(scoreboard.numRoundsPlayed).withContext("numRounds").toBe(6);
        expect(scoreboard.numRoundsWon).withContext("numRoundsWon").toBe(3);
        expect(scoreboard.numRoundsLost).withContext("numRoundsLost").toBe(3);
        expect(scoreboard.numRoundsWinVariance).withContext("numRoundsWinVariance").toBe(0);
        expect(scoreboard.placement).withContext("placement").toBe(1);
    });
    //#endregion

    //#region Sudden Death Conditions
    it("should properly reflect: 4 wins, 4 losses", () => {
        // Arrange
        const scoreboard = new ArenasScoreboard();

        // Act
        scoreboard.addRoundResult(true);
        scoreboard.addRoundResult(false);
        scoreboard.addRoundResult(true);
        scoreboard.addRoundResult(false);
        scoreboard.addRoundResult(true);
        scoreboard.addRoundResult(false);
        scoreboard.addRoundResult(true);
        scoreboard.addRoundResult(false);

        // Assert
        expect(scoreboard.isUnfinished).withContext("isUnfinished").toBe(true);
        expect(scoreboard.roundsResult).withContext("roundsResult").toEqual([true, false, true, false, true, false, true, false]);
        expect(scoreboard.isSuddenDeath).withContext("isSuddenDeath").toBe(true);
        expect(scoreboard.isLoseAtRisk).withContext("isLoseAtRisk").toBe(true);
        expect(scoreboard.isWinAtRisk).withContext("isWinAtRisk").toBe(true);
        expect(scoreboard.hasLost).withContext("hasLost").toBe(false);
        expect(scoreboard.hasWon).withContext("hasWon").toBe(false);
        expect(scoreboard.numRoundsPlayed).withContext("numRounds").toBe(8);
        expect(scoreboard.numRoundsWon).withContext("numRoundsWon").toBe(4);
        expect(scoreboard.numRoundsLost).withContext("numRoundsLost").toBe(4);
        expect(scoreboard.numRoundsWinVariance).withContext("numRoundsWinVariance").toBe(0);
        expect(scoreboard.placement).withContext("placement").toBe(1);
    });
    //#endregion

    //#region Win Match Conditions
    it("should properly reflect: 3 wins, 0 losses", () => {
        // Arrange
        const scoreboard = new ArenasScoreboard();

        // Act
        scoreboard.addRoundResult(true);
        scoreboard.addRoundResult(true);
        scoreboard.addRoundResult(true);

        // Assert
        expect(scoreboard.isUnfinished).withContext("isUnfinished").toBe(false);
        expect(scoreboard.roundsResult).withContext("roundsResult").toEqual([true, true, true]);
        expect(scoreboard.isSuddenDeath).withContext("isSuddenDeath").toBe(false);
        expect(scoreboard.isLoseAtRisk).withContext("isLoseAtRisk").toBe(false);
        expect(scoreboard.isWinAtRisk).withContext("isWinAtRisk").toBe(false);
        expect(scoreboard.hasLost).withContext("hasLost").toBe(false);
        expect(scoreboard.hasWon).withContext("hasWon").toBe(true);
        expect(scoreboard.numRoundsPlayed).withContext("numRounds").toBe(3);
        expect(scoreboard.numRoundsWon).withContext("numRoundsWon").toBe(3);
        expect(scoreboard.numRoundsLost).withContext("numRoundsLost").toBe(0);
        expect(scoreboard.numRoundsWinVariance).withContext("numRoundsWinVariance").toBe(3);
        expect(scoreboard.placement).withContext("placement").toBe(1);
    });
    //#endregion

    //#region Lose Match Conditions
    it("should properly reflect: 0 wins, 3 losses", () => {
        // Arrange
        const scoreboard = new ArenasScoreboard();

        // Act
        scoreboard.addRoundResult(false);
        scoreboard.addRoundResult(false);
        scoreboard.addRoundResult(false);

        // Assert
        expect(scoreboard.isUnfinished).withContext("isUnfinished").toBe(false);
        expect(scoreboard.roundsResult).withContext("roundsResult").toEqual([false, false, false]);
        expect(scoreboard.isSuddenDeath).withContext("isSuddenDeath").toBe(false);
        expect(scoreboard.isLoseAtRisk).withContext("isLoseAtRisk").toBe(false);
        expect(scoreboard.isWinAtRisk).withContext("isWinAtRisk").toBe(false);
        expect(scoreboard.hasLost).withContext("hasLost").toBe(true);
        expect(scoreboard.hasWon).withContext("hasWon").toBe(false);
        expect(scoreboard.numRoundsPlayed).withContext("numRounds").toBe(3);
        expect(scoreboard.numRoundsWon).withContext("numRoundsWon").toBe(0);
        expect(scoreboard.numRoundsLost).withContext("numRoundsLost").toBe(3);
        expect(scoreboard.numRoundsWinVariance).withContext("numRoundsWinVariance").toBe(-3);
        expect(scoreboard.placement).withContext("placement").toBe(2);
    });
    //#endregion

    //#region Error Conditions
    it("should throw error when trying to add a round result on a won match", () => {
        // Arrange
        const scoreboard = new ArenasScoreboard();

        // Act
        scoreboard.addRoundResult(true);
        scoreboard.addRoundResult(true);
        scoreboard.addRoundResult(true);

        // Assert
        expect(scoreboard.addRoundResult).withContext("addRoundResult").toThrowError();
    });

    it("should throw error when trying to add a round result on a lost match", () => {
        // Arrange
        const scoreboard = new ArenasScoreboard();

        // Act
        scoreboard.addRoundResult(false);
        scoreboard.addRoundResult(false);
        scoreboard.addRoundResult(false);

        // Assert
        expect(scoreboard.addRoundResult).withContext("addRoundResult").toThrowError();
    });

    it("should throw error when trying to add a round result after max rounds", () => {
        // Arrange
        const scoreboard = new ArenasScoreboard();

        // Act
        scoreboard.roundsResult.length = 9;

        // Assert
        expect(scoreboard.addRoundResult).withContext("addRoundResult").toThrowError();
    });

    it("should throw error when trying to add a non-boolean value", () => {
        // Arrange
        const scoreboard = new ArenasScoreboard();

        // Act / Assert
        expect(scoreboard.addRoundResult).withContext("addRoundResult").toThrowError();
    });
    //#endregion

    //#region Example Conditions
    it("should properly reflect: 3 wins, 1 losses", () => {
        // Arrange
        const scoreboard = new ArenasScoreboard();

        // Act
        scoreboard.addRoundResult(true);
        scoreboard.addRoundResult(true);
        scoreboard.addRoundResult(false);
        scoreboard.addRoundResult(true);

        // Assert
        expect(scoreboard.isUnfinished).withContext("isUnfinished").toBe(false);
        expect(scoreboard.roundsResult).withContext("roundsResult").toEqual([true, true, false, true]);
        expect(scoreboard.isSuddenDeath).withContext("isSuddenDeath").toBe(false);
        expect(scoreboard.isLoseAtRisk).withContext("isLoseAtRisk").toBe(false);
        expect(scoreboard.isWinAtRisk).withContext("isWinAtRisk").toBe(false);
        expect(scoreboard.hasLost).withContext("hasLost").toBe(false);
        expect(scoreboard.hasWon).withContext("hasWon").toBe(true);
        expect(scoreboard.numRoundsPlayed).withContext("numRounds").toBe(4);
        expect(scoreboard.numRoundsWon).withContext("numRoundsWon").toBe(3);
        expect(scoreboard.numRoundsLost).withContext("numRoundsLost").toBe(1);
        expect(scoreboard.numRoundsWinVariance).withContext("numRoundsWinVariance").toBe(2);
        expect(scoreboard.placement).withContext("placement").toBe(1);
    });

    it("should properly reflect: 4 wins, 2 losses", () => {
        // Arrange
        const scoreboard = new ArenasScoreboard();

        // Act
        scoreboard.addRoundResult(true);
        scoreboard.addRoundResult(true);
        scoreboard.addRoundResult(false);
        scoreboard.addRoundResult(false);
        scoreboard.addRoundResult(true);
        scoreboard.addRoundResult(true);

        // Assert
        expect(scoreboard.isUnfinished).withContext("isUnfinished").toBe(false);
        expect(scoreboard.roundsResult).withContext("roundsResult").toEqual([true, true, false, false, true, true]);
        expect(scoreboard.isSuddenDeath).withContext("isSuddenDeath").toBe(false);
        expect(scoreboard.isLoseAtRisk).withContext("isLoseAtRisk").toBe(false);
        expect(scoreboard.isWinAtRisk).withContext("isWinAtRisk").toBe(false);
        expect(scoreboard.hasLost).withContext("hasLost").toBe(false);
        expect(scoreboard.hasWon).withContext("hasWon").toBe(true);
        expect(scoreboard.numRoundsPlayed).withContext("numRounds").toBe(6);
        expect(scoreboard.numRoundsWon).withContext("numRoundsWon").toBe(4);
        expect(scoreboard.numRoundsLost).withContext("numRoundsLost").toBe(2);
        expect(scoreboard.numRoundsWinVariance).withContext("numRoundsWinVariance").toBe(2);
        expect(scoreboard.placement).withContext("placement").toBe(1);
    });

    it("should properly reflect: 5 wins, 3 losses", () => {
        // Arrange
        const scoreboard = new ArenasScoreboard();

        // Act
        scoreboard.addRoundResult(true);
        scoreboard.addRoundResult(true);
        scoreboard.addRoundResult(false);
        scoreboard.addRoundResult(false);
        scoreboard.addRoundResult(true);
        scoreboard.addRoundResult(false);
        scoreboard.addRoundResult(true);
        scoreboard.addRoundResult(true);

        // Assert
        expect(scoreboard.isUnfinished).withContext("isUnfinished").toBe(false);
        expect(scoreboard.roundsResult).withContext("roundsResult").toEqual([true, true, false, false, true, false, true, true]);
        expect(scoreboard.isSuddenDeath).withContext("isSuddenDeath").toBe(false);
        expect(scoreboard.isLoseAtRisk).withContext("isLoseAtRisk").toBe(false);
        expect(scoreboard.isWinAtRisk).withContext("isWinAtRisk").toBe(false);
        expect(scoreboard.hasLost).withContext("hasLost").toBe(false);
        expect(scoreboard.hasWon).withContext("hasWon").toBe(true);
        expect(scoreboard.numRoundsPlayed).withContext("numRounds").toBe(8);
        expect(scoreboard.numRoundsWon).withContext("numRoundsWon").toBe(5);
        expect(scoreboard.numRoundsLost).withContext("numRoundsLost").toBe(3);
        expect(scoreboard.numRoundsWinVariance).withContext("numRoundsWinVariance").toBe(2);
        expect(scoreboard.placement).withContext("placement").toBe(1);
    });
    //#endregion
});
