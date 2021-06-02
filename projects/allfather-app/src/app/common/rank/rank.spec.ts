import { Rank, RankTierDivisionMap, RankTierName } from "./rank";

describe("Rank", () => {
    it("should default to Bronze IV", () => {
        // Arrange / Act
        const rankEmpty1 = new Rank();
        const rankEmpty2 = new Rank({});
        const rankInfinity = new Rank({ score: Infinity });
        const rankNegInfinity = new Rank({ score: -Infinity });
        const rankNeg = new Rank({ score: -1 });
        const rankZero = new Rank({ score: 0 });

        // Assert
        expect(rankEmpty1.score).withContext(`rankEmpty1`).toBe(0);
        expect(rankEmpty1.tierName).withContext(`rankEmpty1`).toBe(RankTierName.Bronze);
        expect(rankEmpty1.tierDivision).withContext(`rankEmpty1`).toBe(RankTierDivisionMap[4]);
        expect(rankEmpty2.score).withContext(`rankEmpty2`).toBe(0);
        expect(rankEmpty2.tierName).withContext(`rankEmpty2`).toBe(RankTierName.Bronze);
        expect(rankEmpty2.tierDivision).withContext(`rankEmpty2`).toBe(RankTierDivisionMap[4]);
        expect(rankInfinity.score).withContext(`rankInfinity`).toBePositiveInfinity();
        expect(rankInfinity.tierName).withContext(`rankInfinity`).toBe(RankTierName.Bronze);
        expect(rankInfinity.tierDivision).withContext(`rankInfinity`).toBe(RankTierDivisionMap[4]);
        expect(rankNegInfinity.score).withContext(`rankNegInfinity`).toBeNegativeInfinity();
        expect(rankNegInfinity.tierName).withContext(`rankNegInfinity`).toBe(RankTierName.Bronze);
        expect(rankNegInfinity.tierDivision).withContext(`rankNegInfinity`).toBe(RankTierDivisionMap[4]);
        expect(rankNeg.score).withContext(`rankNeg`).toBe(-1);
        expect(rankNeg.tierName).withContext(`rankNeg`).toBe(RankTierName.Bronze);
        expect(rankNeg.tierDivision).withContext(`rankNeg`).toBe(RankTierDivisionMap[4]);
        expect(rankZero.score).withContext(`rankZero`).toBe(0);
        expect(rankZero.tierName).withContext(`rankZero`).toBe(RankTierName.Bronze);
        expect(rankZero.tierDivision).withContext(`rankZero`).toBe(RankTierDivisionMap[4]);
    });

    //#region By Score
    it("should map to Bronze by score", () => {
        // Arrange / Act
        const bronzeRank4 = new Rank({ score: 0 });
        const bronzeRank3 = new Rank({ score: 300 });
        const bronzeRank2 = new Rank({ score: 600 });
        const bronzeRank1 = new Rank({ score: 900 });

        // Assert
        expect(bronzeRank4.score).withContext(`bronzeRank4`).toBe(0);
        expect(bronzeRank4.tierName).withContext(`bronzeRank4`).toBe(RankTierName.Bronze);
        expect(bronzeRank4.tierDivision).withContext(`bronzeRank4`).toBe(RankTierDivisionMap[4]);
        expect(bronzeRank4.tierDivisionMinScore).withContext(`bronzeRank4`).toBe(0);
        expect(bronzeRank3.score).withContext(`bronzeRank3`).toBe(300);
        expect(bronzeRank3.tierName).withContext(`bronzeRank3`).toBe(RankTierName.Bronze);
        expect(bronzeRank3.tierDivision).withContext(`bronzeRank3`).toBe(RankTierDivisionMap[3]);
        expect(bronzeRank3.tierDivisionMinScore).withContext(`bronzeRank3`).toBe(300);
        expect(bronzeRank2.score).withContext(`bronzeRank2`).toBe(600);
        expect(bronzeRank2.tierName).withContext(`bronzeRank2`).toBe(RankTierName.Bronze);
        expect(bronzeRank2.tierDivision).withContext(`bronzeRank2`).toBe(RankTierDivisionMap[2]);
        expect(bronzeRank2.tierDivisionMinScore).withContext(`bronzeRank2`).toBe(600);
        expect(bronzeRank1.score).withContext(`bronzeRank1`).toBe(900);
        expect(bronzeRank1.tierName).withContext(`bronzeRank1`).toBe(RankTierName.Bronze);
        expect(bronzeRank1.tierDivision).withContext(`bronzeRank1`).toBe(RankTierDivisionMap[1]);
        expect(bronzeRank1.tierDivisionMinScore).withContext(`bronzeRank1`).toBe(900);
    });

    it("should map to Silver by score", () => {
        // Arrange / Act
        const silverRank4 = new Rank({ score: 1200 });
        const silverRank3 = new Rank({ score: 1600 });
        const silverRank2 = new Rank({ score: 2000 });
        const silverRank1 = new Rank({ score: 2400 });

        // Assert
        expect(silverRank4.score).withContext(`silverRank4`).toBe(1200);
        expect(silverRank4.tierName).withContext(`silverRank4`).toBe(RankTierName.Silver);
        expect(silverRank4.tierDivision).withContext(`silverRank4`).toBe(RankTierDivisionMap[4]);
        expect(silverRank4.tierDivisionMinScore).withContext(`silverRank4`).toBe(1200);
        expect(silverRank3.score).withContext(`silverRank3`).toBe(1600);
        expect(silverRank3.tierName).withContext(`silverRank3`).toBe(RankTierName.Silver);
        expect(silverRank3.tierDivision).withContext(`silverRank3`).toBe(RankTierDivisionMap[3]);
        expect(silverRank3.tierDivisionMinScore).withContext(`silverRank3`).toBe(1600);
        expect(silverRank2.score).withContext(`silverRank2`).toBe(2000);
        expect(silverRank2.tierName).withContext(`silverRank2`).toBe(RankTierName.Silver);
        expect(silverRank2.tierDivision).withContext(`silverRank2`).toBe(RankTierDivisionMap[2]);
        expect(silverRank2.tierDivisionMinScore).withContext(`silverRank2`).toBe(2000);
        expect(silverRank1.score).withContext(`silverRank1`).toBe(2400);
        expect(silverRank1.tierName).withContext(`silverRank1`).toBe(RankTierName.Silver);
        expect(silverRank1.tierDivision).withContext(`silverRank1`).toBe(RankTierDivisionMap[1]);
        expect(silverRank1.tierDivisionMinScore).withContext(`silverRank1`).toBe(2400);
    });

    it("should map to Gold by score", () => {
        // Arrange / Act
        const goldRank4 = new Rank({ score: 2800 });
        const goldRank3 = new Rank({ score: 3300 });
        const goldRank2 = new Rank({ score: 3800 });
        const goldRank1 = new Rank({ score: 4300 });

        // Assert
        expect(goldRank4.score).withContext(`goldRank4`).toBe(2800);
        expect(goldRank4.tierName).withContext(`goldRank4`).toBe(RankTierName.Gold);
        expect(goldRank4.tierDivision).withContext(`goldRank4`).toBe(RankTierDivisionMap[4]);
        expect(goldRank4.tierDivisionMinScore).withContext(`goldRank4`).toBe(2800);
        expect(goldRank3.score).withContext(`goldRank3`).toBe(3300);
        expect(goldRank3.tierName).withContext(`goldRank3`).toBe(RankTierName.Gold);
        expect(goldRank3.tierDivision).withContext(`goldRank3`).toBe(RankTierDivisionMap[3]);
        expect(goldRank3.tierDivisionMinScore).withContext(`goldRank3`).toBe(3300);
        expect(goldRank2.score).withContext(`goldRank2`).toBe(3800);
        expect(goldRank2.tierName).withContext(`goldRank2`).toBe(RankTierName.Gold);
        expect(goldRank2.tierDivision).withContext(`goldRank2`).toBe(RankTierDivisionMap[2]);
        expect(goldRank2.tierDivisionMinScore).withContext(`goldRank2`).toBe(3800);
        expect(goldRank1.score).withContext(`goldRank1`).toBe(4300);
        expect(goldRank1.tierName).withContext(`goldRank1`).toBe(RankTierName.Gold);
        expect(goldRank1.tierDivision).withContext(`goldRank1`).toBe(RankTierDivisionMap[1]);
        expect(goldRank1.tierDivisionMinScore).withContext(`goldRank1`).toBe(4300);
    });

    it("should map to Platinum by score", () => {
        // Arrange / Act
        const platinumRank4 = new Rank({ score: 4800 });
        const platinumRank3 = new Rank({ score: 5400 });
        const platinumRank2 = new Rank({ score: 6000 });
        const platinumRank1 = new Rank({ score: 6600 });

        // Assert
        expect(platinumRank4.score).withContext(`platinumRank4`).toBe(4800);
        expect(platinumRank4.tierName).withContext(`platinumRank4`).toBe(RankTierName.Platinum);
        expect(platinumRank4.tierDivision).withContext(`platinumRank4`).toBe(RankTierDivisionMap[4]);
        expect(platinumRank4.tierDivisionMinScore).withContext(`platinumRank4`).toBe(4800);
        expect(platinumRank3.score).withContext(`platinumRank3`).toBe(5400);
        expect(platinumRank3.tierName).withContext(`platinumRank3`).toBe(RankTierName.Platinum);
        expect(platinumRank3.tierDivision).withContext(`platinumRank3`).toBe(RankTierDivisionMap[3]);
        expect(platinumRank3.tierDivisionMinScore).withContext(`platinumRank3`).toBe(5400);
        expect(platinumRank2.score).withContext(`platinumRank2`).toBe(6000);
        expect(platinumRank2.tierName).withContext(`platinumRank2`).toBe(RankTierName.Platinum);
        expect(platinumRank2.tierDivision).withContext(`platinumRank2`).toBe(RankTierDivisionMap[2]);
        expect(platinumRank2.tierDivisionMinScore).withContext(`platinumRank2`).toBe(6000);
        expect(platinumRank1.score).withContext(`platinumRank1`).toBe(6600);
        expect(platinumRank1.tierName).withContext(`platinumRank1`).toBe(RankTierName.Platinum);
        expect(platinumRank1.tierDivision).withContext(`platinumRank1`).toBe(RankTierDivisionMap[1]);
        expect(platinumRank1.tierDivisionMinScore).withContext(`platinumRank1`).toBe(6600);
    });

    it("should map to Diamond by score", () => {
        // Arrange / Act
        const diamondRank4 = new Rank({ score: 7200 });
        const diamondRank3 = new Rank({ score: 7900 });
        const diamondRank2 = new Rank({ score: 8600 });
        const diamondRank1 = new Rank({ score: 9300 });

        // Assert
        expect(diamondRank4.score).withContext(`diamondRank4`).toBe(7200);
        expect(diamondRank4.tierName).withContext(`diamondRank4`).toBe(RankTierName.Diamond);
        expect(diamondRank4.tierDivision).withContext(`diamondRank4`).toBe(RankTierDivisionMap[4]);
        expect(diamondRank4.tierDivisionMinScore).withContext(`diamondRank4`).toBe(7200);
        expect(diamondRank3.score).withContext(`diamondRank3`).toBe(7900);
        expect(diamondRank3.tierName).withContext(`diamondRank3`).toBe(RankTierName.Diamond);
        expect(diamondRank3.tierDivision).withContext(`diamondRank3`).toBe(RankTierDivisionMap[3]);
        expect(diamondRank3.tierDivisionMinScore).withContext(`diamondRank3`).toBe(7900);
        expect(diamondRank2.score).withContext(`diamondRank2`).toBe(8600);
        expect(diamondRank2.tierName).withContext(`diamondRank2`).toBe(RankTierName.Diamond);
        expect(diamondRank2.tierDivision).withContext(`diamondRank2`).toBe(RankTierDivisionMap[2]);
        expect(diamondRank2.tierDivisionMinScore).withContext(`diamondRank2`).toBe(8600);
        expect(diamondRank1.score).withContext(`diamondRank1`).toBe(9300);
        expect(diamondRank1.tierName).withContext(`diamondRank1`).toBe(RankTierName.Diamond);
        expect(diamondRank1.tierDivision).withContext(`diamondRank1`).toBe(RankTierDivisionMap[1]);
        expect(diamondRank1.tierDivisionMinScore).withContext(`diamondRank1`).toBe(9300);
    });

    it("should map to Master by score", () => {
        // Arrange / Act
        const masterRank = new Rank({ score: 10000 });

        // Assert
        expect(masterRank.score).withContext(`masterRank`).toBe(10000);
        expect(masterRank.tierName).withContext(`masterRank`).toBe(RankTierName.Master);
        expect(masterRank.tierDivision).withContext(`masterRank`).toBe(RankTierDivisionMap[0]);
        expect(masterRank.tierDivisionMinScore).withContext(`masterRank`).toBe(10000);
    });
    //#endregion

    //#region By given Name + Division
    it("should map to Bronze by given name", () => {
        // Arrange / Act
        const bronzeRank4 = new Rank({ tierName: "bronze", tierDivision: 4 });
        const bronzeRank3 = new Rank({ tierName: "bronze", tierDivision: 3 });
        const bronzeRank2 = new Rank({ tierName: "Bronze", tierDivision: 2 });
        const bronzeRank1 = new Rank({ tierName: "Bronze", tierDivision: 1 });

        // Assert
        expect(bronzeRank4.score).withContext(`bronzeRank4`).toBe(0);
        expect(bronzeRank4.tierName).withContext(`bronzeRank4`).toBe(RankTierName.Bronze);
        expect(bronzeRank4.tierDivision).withContext(`bronzeRank4`).toBe(RankTierDivisionMap[4]);
        expect(bronzeRank4.tierDivisionMinScore).withContext(`bronzeRank4`).toBe(0);
        expect(bronzeRank3.score).withContext(`bronzeRank3`).toBe(300);
        expect(bronzeRank3.tierName).withContext(`bronzeRank3`).toBe(RankTierName.Bronze);
        expect(bronzeRank3.tierDivision).withContext(`bronzeRank3`).toBe(RankTierDivisionMap[3]);
        expect(bronzeRank3.tierDivisionMinScore).withContext(`bronzeRank3`).toBe(300);
        expect(bronzeRank2.score).withContext(`bronzeRank2`).toBe(600);
        expect(bronzeRank2.tierName).withContext(`bronzeRank2`).toBe(RankTierName.Bronze);
        expect(bronzeRank2.tierDivision).withContext(`bronzeRank2`).toBe(RankTierDivisionMap[2]);
        expect(bronzeRank2.tierDivisionMinScore).withContext(`bronzeRank2`).toBe(600);
        expect(bronzeRank1.score).withContext(`bronzeRank1`).toBe(900);
        expect(bronzeRank1.tierName).withContext(`bronzeRank1`).toBe(RankTierName.Bronze);
        expect(bronzeRank1.tierDivision).withContext(`bronzeRank1`).toBe(RankTierDivisionMap[1]);
        expect(bronzeRank1.tierDivisionMinScore).withContext(`bronzeRank1`).toBe(900);
    });

    it("should map to Silver by given name", () => {
        // Arrange / Act
        const silverRank4 = new Rank({ tierName: "silver", tierDivision: 4 });
        const silverRank3 = new Rank({ tierName: "silver", tierDivision: 3 });
        const silverRank2 = new Rank({ tierName: "Silver", tierDivision: 2 });
        const silverRank1 = new Rank({ tierName: "Silver", tierDivision: 1 });

        // Assert
        expect(silverRank4.score).withContext(`silverRank4`).toBe(1200);
        expect(silverRank4.tierName).withContext(`silverRank4`).toBe(RankTierName.Silver);
        expect(silverRank4.tierDivision).withContext(`silverRank4`).toBe(RankTierDivisionMap[4]);
        expect(silverRank4.tierDivisionMinScore).withContext(`silverRank4`).toBe(1200);
        expect(silverRank3.score).withContext(`silverRank3`).toBe(1600);
        expect(silverRank3.tierName).withContext(`silverRank3`).toBe(RankTierName.Silver);
        expect(silverRank3.tierDivision).withContext(`silverRank3`).toBe(RankTierDivisionMap[3]);
        expect(silverRank3.tierDivisionMinScore).withContext(`silverRank3`).toBe(1600);
        expect(silverRank2.score).withContext(`silverRank2`).toBe(2000);
        expect(silverRank2.tierName).withContext(`silverRank2`).toBe(RankTierName.Silver);
        expect(silverRank2.tierDivision).withContext(`silverRank2`).toBe(RankTierDivisionMap[2]);
        expect(silverRank2.tierDivisionMinScore).withContext(`silverRank2`).toBe(2000);
        expect(silverRank1.score).withContext(`silverRank1`).toBe(2400);
        expect(silverRank1.tierName).withContext(`silverRank1`).toBe(RankTierName.Silver);
        expect(silverRank1.tierDivision).withContext(`silverRank1`).toBe(RankTierDivisionMap[1]);
        expect(silverRank1.tierDivisionMinScore).withContext(`silverRank1`).toBe(2400);
    });

    it("should map to Gold by given name", () => {
        // Arrange / Act
        const goldRank4 = new Rank({ tierName: "gold", tierDivision: 4 });
        const goldRank3 = new Rank({ tierName: "gold", tierDivision: 3 });
        const goldRank2 = new Rank({ tierName: "Gold", tierDivision: 2 });
        const goldRank1 = new Rank({ tierName: "Gold", tierDivision: 1 });

        // Assert
        expect(goldRank4.score).withContext(`goldRank4`).toBe(2800);
        expect(goldRank4.tierName).withContext(`goldRank4`).toBe(RankTierName.Gold);
        expect(goldRank4.tierDivision).withContext(`goldRank4`).toBe(RankTierDivisionMap[4]);
        expect(goldRank4.tierDivisionMinScore).withContext(`goldRank4`).toBe(2800);
        expect(goldRank3.score).withContext(`goldRank3`).toBe(3300);
        expect(goldRank3.tierName).withContext(`goldRank3`).toBe(RankTierName.Gold);
        expect(goldRank3.tierDivision).withContext(`goldRank3`).toBe(RankTierDivisionMap[3]);
        expect(goldRank3.tierDivisionMinScore).withContext(`goldRank3`).toBe(3300);
        expect(goldRank2.score).withContext(`goldRank2`).toBe(3800);
        expect(goldRank2.tierName).withContext(`goldRank2`).toBe(RankTierName.Gold);
        expect(goldRank2.tierDivision).withContext(`goldRank2`).toBe(RankTierDivisionMap[2]);
        expect(goldRank2.tierDivisionMinScore).withContext(`goldRank2`).toBe(3800);
        expect(goldRank1.score).withContext(`goldRank1`).toBe(4300);
        expect(goldRank1.tierName).withContext(`goldRank1`).toBe(RankTierName.Gold);
        expect(goldRank1.tierDivision).withContext(`goldRank1`).toBe(RankTierDivisionMap[1]);
        expect(goldRank1.tierDivisionMinScore).withContext(`goldRank1`).toBe(4300);
    });

    it("should map to Platinum by given name", () => {
        // Arrange / Act
        const platinumRank4 = new Rank({ tierName: "platinum", tierDivision: 4 });
        const platinumRank3 = new Rank({ tierName: "platinum", tierDivision: 3 });
        const platinumRank2 = new Rank({ tierName: "Platinum", tierDivision: 2 });
        const platinumRank1 = new Rank({ tierName: "Platinum", tierDivision: 1 });

        // Assert
        expect(platinumRank4.score).withContext(`platinumRank4`).toBe(4800);
        expect(platinumRank4.tierName).withContext(`platinumRank4`).toBe(RankTierName.Platinum);
        expect(platinumRank4.tierDivision).withContext(`platinumRank4`).toBe(RankTierDivisionMap[4]);
        expect(platinumRank4.tierDivisionMinScore).withContext(`platinumRank4`).toBe(4800);
        expect(platinumRank3.score).withContext(`platinumRank3`).toBe(5400);
        expect(platinumRank3.tierName).withContext(`platinumRank3`).toBe(RankTierName.Platinum);
        expect(platinumRank3.tierDivision).withContext(`platinumRank3`).toBe(RankTierDivisionMap[3]);
        expect(platinumRank3.tierDivisionMinScore).withContext(`platinumRank3`).toBe(5400);
        expect(platinumRank2.score).withContext(`platinumRank2`).toBe(6000);
        expect(platinumRank2.tierName).withContext(`platinumRank2`).toBe(RankTierName.Platinum);
        expect(platinumRank2.tierDivision).withContext(`platinumRank2`).toBe(RankTierDivisionMap[2]);
        expect(platinumRank2.tierDivisionMinScore).withContext(`platinumRank2`).toBe(6000);
        expect(platinumRank1.score).withContext(`platinumRank1`).toBe(6600);
        expect(platinumRank1.tierName).withContext(`platinumRank1`).toBe(RankTierName.Platinum);
        expect(platinumRank1.tierDivision).withContext(`platinumRank1`).toBe(RankTierDivisionMap[1]);
        expect(platinumRank1.tierDivisionMinScore).withContext(`platinumRank1`).toBe(6600);
    });

    it("should map to Diamond by given name", () => {
        // Arrange / Act
        const diamondRank4 = new Rank({ tierName: "diamond", tierDivision: 4 });
        const diamondRank3 = new Rank({ tierName: "diamond", tierDivision: 3 });
        const diamondRank2 = new Rank({ tierName: "Diamond", tierDivision: 2 });
        const diamondRank1 = new Rank({ tierName: "Diamond", tierDivision: 1 });

        // Assert
        expect(diamondRank4.score).withContext(`diamondRank4`).toBe(7200);
        expect(diamondRank4.tierName).withContext(`diamondRank4`).toBe(RankTierName.Diamond);
        expect(diamondRank4.tierDivision).withContext(`diamondRank4`).toBe(RankTierDivisionMap[4]);
        expect(diamondRank4.tierDivisionMinScore).withContext(`diamondRank4`).toBe(7200);
        expect(diamondRank3.score).withContext(`diamondRank3`).toBe(7900);
        expect(diamondRank3.tierName).withContext(`diamondRank3`).toBe(RankTierName.Diamond);
        expect(diamondRank3.tierDivision).withContext(`diamondRank3`).toBe(RankTierDivisionMap[3]);
        expect(diamondRank3.tierDivisionMinScore).withContext(`diamondRank3`).toBe(7900);
        expect(diamondRank2.score).withContext(`diamondRank2`).toBe(8600);
        expect(diamondRank2.tierName).withContext(`diamondRank2`).toBe(RankTierName.Diamond);
        expect(diamondRank2.tierDivision).withContext(`diamondRank2`).toBe(RankTierDivisionMap[2]);
        expect(diamondRank2.tierDivisionMinScore).withContext(`diamondRank2`).toBe(8600);
        expect(diamondRank1.score).withContext(`diamondRank1`).toBe(9300);
        expect(diamondRank1.tierName).withContext(`diamondRank1`).toBe(RankTierName.Diamond);
        expect(diamondRank1.tierDivision).withContext(`diamondRank1`).toBe(RankTierDivisionMap[1]);
        expect(diamondRank1.tierDivisionMinScore).withContext(`diamondRank1`).toBe(9300);
    });

    it("should map to Master by given name", () => {
        // Arrange / Act
        const masterRankDiv1 = new Rank({ tierName: "master", tierDivision: 0 });
        const masterRankNoDiv1 = new Rank({ tierName: "master" });
        const masterRankDiv2 = new Rank({ tierName: "Master", tierDivision: 0 });
        const masterRankNoDiv2 = new Rank({ tierName: "Master" });

        // Assert
        expect(masterRankDiv1.score).withContext(`masterRankDiv1`).toBe(10000);
        expect(masterRankDiv1.tierName).withContext(`masterRankDiv1`).toBe(RankTierName.Master);
        expect(masterRankDiv1.tierDivision).withContext(`masterRankDiv1`).toBe(RankTierDivisionMap[0]);
        expect(masterRankDiv1.tierDivisionMinScore).withContext(`masterRankDiv1`).toBe(10000);
        expect(masterRankNoDiv1.score).withContext(`masterRankNoDiv1`).toBe(10000);
        expect(masterRankNoDiv1.tierName).withContext(`masterRankNoDiv1`).toBe(RankTierName.Master);
        expect(masterRankNoDiv1.tierDivision).withContext(`masterRankNoDiv1`).toBe(RankTierDivisionMap[0]);
        expect(masterRankNoDiv1.tierDivisionMinScore).withContext(`masterRankNoDiv1`).toBe(10000);
        expect(masterRankDiv2.score).withContext(`masterRankDiv2`).toBe(10000);
        expect(masterRankDiv2.tierName).withContext(`masterRankDiv2`).toBe(RankTierName.Master);
        expect(masterRankDiv2.tierDivision).withContext(`masterRankDiv2`).toBe(RankTierDivisionMap[0]);
        expect(masterRankDiv2.tierDivisionMinScore).withContext(`masterRankDiv2`).toBe(10000);
        expect(masterRankNoDiv2.score).withContext(`masterRankNoDiv2`).toBe(10000);
        expect(masterRankNoDiv2.tierName).withContext(`masterRankNoDiv2`).toBe(RankTierName.Master);
        expect(masterRankNoDiv2.tierDivision).withContext(`masterRankNoDiv2`).toBe(RankTierDivisionMap[0]);
        expect(masterRankNoDiv2.tierDivisionMinScore).withContext(`masterRankNoDiv2`).toBe(10000);
    });

    it("should map to Apex Predator by given name", () => {
        // Arrange / Act
        const apexPredatorRankDiv1 = new Rank({ tierName: "Apex_Predator", tierDivision: 0 });
        const apexPredatorRankNoDiv1 = new Rank({ tierName: "apex predator" });
        const apexPredatorRankDiv2 = new Rank({ tierName: "apex Predator", tierDivision: 0 });
        const apexPredatorRankNoDiv2 = new Rank({ tierName: "Apex Predator" });

        // Assert
        expect(apexPredatorRankDiv1.score).withContext(`apexPredatorRankDiv1`).toBe(Infinity);
        expect(apexPredatorRankDiv1.tierName).withContext(`apexPredatorRankDiv1`).toBe(RankTierName.ApexPredator);
        expect(apexPredatorRankDiv1.tierDivision).withContext(`apexPredatorRankDiv1`).toBe(RankTierDivisionMap[0]);
        expect(apexPredatorRankDiv1.tierDivisionMinScore).withContext(`apexPredatorRankDiv1`).toBe(Infinity);
        expect(apexPredatorRankNoDiv1.score).withContext(`apexPredatorRankNoDiv1`).toBe(Infinity);
        expect(apexPredatorRankNoDiv1.tierName).withContext(`apexPredatorRankNoDiv1`).toBe(RankTierName.ApexPredator);
        expect(apexPredatorRankNoDiv1.tierDivision).withContext(`apexPredatorRankNoDiv1`).toBe(RankTierDivisionMap[0]);
        expect(apexPredatorRankNoDiv1.tierDivisionMinScore).withContext(`apexPredatorRankNoDiv1`).toBe(Infinity);
        expect(apexPredatorRankDiv2.score).withContext(`apexPredatorRankDiv2`).toBe(Infinity);
        expect(apexPredatorRankDiv2.tierName).withContext(`apexPredatorRankDiv2`).toBe(RankTierName.ApexPredator);
        expect(apexPredatorRankDiv2.tierDivision).withContext(`apexPredatorRankDiv2`).toBe(RankTierDivisionMap[0]);
        expect(apexPredatorRankDiv2.tierDivisionMinScore).withContext(`apexPredatorRankDiv2`).toBe(Infinity);
        expect(apexPredatorRankNoDiv2.score).withContext(`apexPredatorRankNoDiv2`).toBe(Infinity);
        expect(apexPredatorRankNoDiv2.tierName).withContext(`apexPredatorRankNoDiv2`).toBe(RankTierName.ApexPredator);
        expect(apexPredatorRankNoDiv2.tierDivision).withContext(`apexPredatorRankNoDiv2`).toBe(RankTierDivisionMap[0]);
        expect(apexPredatorRankNoDiv2.tierDivisionMinScore).withContext(`apexPredatorRankNoDiv2`).toBe(Infinity);
    });
    //#endregion
});
