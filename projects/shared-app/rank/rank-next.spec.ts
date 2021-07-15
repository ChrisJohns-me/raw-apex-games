import { Rank, RankTierDivisionMap, RankTierName } from "./rank";
import { RankNext } from "./rank-next";

describe("RankNext", () => {
    //#region From Class
    it("should be created from Bronze Rank class", () => {
        // Arrange
        const bronzeRank4 = new Rank({ score: 0 });
        const bronzeRank3 = new Rank({ score: 300 });
        const bronzeRank2 = new Rank({ score: 600 });
        const bronzeRank1 = new Rank({ score: 900 });

        // Act
        const nextBronzeRank4 = new RankNext(bronzeRank4);
        const nextBronzeRank3 = new RankNext(bronzeRank3);
        const nextBronzeRank2 = new RankNext(bronzeRank2);
        const nextBronzeRank1 = new RankNext(bronzeRank1);

        // Assert
        expect(nextBronzeRank4.tierDivisionMinScore).withContext(`nextBronzeRank4`).toBe(300);
        expect(nextBronzeRank4.tierName).withContext(`nextBronzeRank4`).toBe(RankTierName.Bronze);
        expect(nextBronzeRank4.tierDivision).withContext(`nextBronzeRank4`).toBe(RankTierDivisionMap[3]);
        expect(nextBronzeRank3.tierDivisionMinScore).withContext(`nextBronzeRank3`).toBe(600);
        expect(nextBronzeRank3.tierName).withContext(`nextBronzeRank3`).toBe(RankTierName.Bronze);
        expect(nextBronzeRank3.tierDivision).withContext(`nextBronzeRank3`).toBe(RankTierDivisionMap[2]);
        expect(nextBronzeRank2.tierDivisionMinScore).withContext(`nextBronzeRank2`).toBe(900);
        expect(nextBronzeRank2.tierName).withContext(`nextBronzeRank2`).toBe(RankTierName.Bronze);
        expect(nextBronzeRank2.tierDivision).withContext(`nextBronzeRank2`).toBe(RankTierDivisionMap[1]);
        expect(nextBronzeRank1.tierDivisionMinScore).withContext(`nextBronzeRank1`).toBe(1200);
        expect(nextBronzeRank1.tierName).withContext(`nextBronzeRank1`).toBe(RankTierName.Silver);
        expect(nextBronzeRank1.tierDivision).withContext(`nextBronzeRank1`).toBe(RankTierDivisionMap[4]);
    });

    it("should be created from Silver Rank class", () => {
        // Arrange
        const silverRank4 = new Rank({ score: 1200 });
        const silverRank3 = new Rank({ score: 1600 });
        const silverRank2 = new Rank({ score: 2000 });
        const silverRank1 = new Rank({ score: 2400 });

        // Act
        const nextSilverRank4 = new RankNext(silverRank4);
        const nextSilverRank3 = new RankNext(silverRank3);
        const nextSilverRank2 = new RankNext(silverRank2);
        const nextSilverRank1 = new RankNext(silverRank1);

        // Assert
        expect(nextSilverRank4.tierDivisionMinScore).withContext(`nextSilverRank4`).toBe(1600);
        expect(nextSilverRank4.tierName).withContext(`nextSilverRank4`).toBe(RankTierName.Silver);
        expect(nextSilverRank4.tierDivision).withContext(`nextSilverRank4`).toBe(RankTierDivisionMap[3]);
        expect(nextSilverRank3.tierDivisionMinScore).withContext(`nextSilverRank3`).toBe(2000);
        expect(nextSilverRank3.tierName).withContext(`nextSilverRank3`).toBe(RankTierName.Silver);
        expect(nextSilverRank3.tierDivision).withContext(`nextSilverRank3`).toBe(RankTierDivisionMap[2]);
        expect(nextSilverRank2.tierDivisionMinScore).withContext(`nextSilverRank2`).toBe(2400);
        expect(nextSilverRank2.tierName).withContext(`nextSilverRank2`).toBe(RankTierName.Silver);
        expect(nextSilverRank2.tierDivision).withContext(`nextSilverRank2`).toBe(RankTierDivisionMap[1]);
        expect(nextSilverRank1.tierDivisionMinScore).withContext(`nextSilverRank1`).toBe(2800);
        expect(nextSilverRank1.tierName).withContext(`nextSilverRank1`).toBe(RankTierName.Gold);
        expect(nextSilverRank1.tierDivision).withContext(`nextSilverRank1`).toBe(RankTierDivisionMap[4]);
    });

    it("should be created from Gold Rank class", () => {
        // Arrange
        const goldRank4 = new Rank({ score: 2800 });
        const goldRank3 = new Rank({ score: 3300 });
        const goldRank2 = new Rank({ score: 3800 });
        const goldRank1 = new Rank({ score: 4300 });

        // Act
        const nextGoldRank4 = new RankNext(goldRank4);
        const nextGoldRank3 = new RankNext(goldRank3);
        const nextGoldRank2 = new RankNext(goldRank2);
        const nextGoldRank1 = new RankNext(goldRank1);

        // Assert
        expect(nextGoldRank4.tierDivisionMinScore).withContext(`nextGoldRank4`).toBe(3300);
        expect(nextGoldRank4.tierName).withContext(`nextGoldRank4`).toBe(RankTierName.Gold);
        expect(nextGoldRank4.tierDivision).withContext(`nextGoldRank4`).toBe(RankTierDivisionMap[3]);
        expect(nextGoldRank3.tierDivisionMinScore).withContext(`nextGoldRank3`).toBe(3800);
        expect(nextGoldRank3.tierName).withContext(`nextGoldRank3`).toBe(RankTierName.Gold);
        expect(nextGoldRank3.tierDivision).withContext(`nextGoldRank3`).toBe(RankTierDivisionMap[2]);
        expect(nextGoldRank2.tierDivisionMinScore).withContext(`nextGoldRank2`).toBe(4300);
        expect(nextGoldRank2.tierName).withContext(`nextGoldRank2`).toBe(RankTierName.Gold);
        expect(nextGoldRank2.tierDivision).withContext(`nextGoldRank2`).toBe(RankTierDivisionMap[1]);
        expect(nextGoldRank1.tierDivisionMinScore).withContext(`nextGoldRank1`).toBe(4800);
        expect(nextGoldRank1.tierName).withContext(`nextGoldRank1`).toBe(RankTierName.Platinum);
        expect(nextGoldRank1.tierDivision).withContext(`nextGoldRank1`).toBe(RankTierDivisionMap[4]);
    });

    it("should be created from Platinum Rank class", () => {
        // Arrange
        const platinumRank4 = new Rank({ score: 4800 });
        const platinumRank3 = new Rank({ score: 5400 });
        const platinumRank2 = new Rank({ score: 6000 });
        const platinumRank1 = new Rank({ score: 6600 });

        // Act
        const nextPlatinumRank4 = new RankNext(platinumRank4);
        const nextPlatinumRank3 = new RankNext(platinumRank3);
        const nextPlatinumRank2 = new RankNext(platinumRank2);
        const nextPlatinumRank1 = new RankNext(platinumRank1);

        // Assert
        expect(nextPlatinumRank4.tierDivisionMinScore).withContext(`nextPlatinumRank4`).toBe(5400);
        expect(nextPlatinumRank4.tierName).withContext(`nextPlatinumRank4`).toBe(RankTierName.Platinum);
        expect(nextPlatinumRank4.tierDivision).withContext(`nextPlatinumRank4`).toBe(RankTierDivisionMap[3]);
        expect(nextPlatinumRank3.tierDivisionMinScore).withContext(`nextPlatinumRank3`).toBe(6000);
        expect(nextPlatinumRank3.tierName).withContext(`nextPlatinumRank3`).toBe(RankTierName.Platinum);
        expect(nextPlatinumRank3.tierDivision).withContext(`nextPlatinumRank3`).toBe(RankTierDivisionMap[2]);
        expect(nextPlatinumRank2.tierDivisionMinScore).withContext(`nextPlatinumRank2`).toBe(6600);
        expect(nextPlatinumRank2.tierName).withContext(`nextPlatinumRank2`).toBe(RankTierName.Platinum);
        expect(nextPlatinumRank2.tierDivision).withContext(`nextPlatinumRank2`).toBe(RankTierDivisionMap[1]);
        expect(nextPlatinumRank1.tierDivisionMinScore).withContext(`nextPlatinumRank1`).toBe(7200);
        expect(nextPlatinumRank1.tierName).withContext(`nextPlatinumRank1`).toBe(RankTierName.Diamond);
        expect(nextPlatinumRank1.tierDivision).withContext(`nextPlatinumRank1`).toBe(RankTierDivisionMap[4]);
    });

    it("should be created from Diamond Rank class", () => {
        // Arrange
        const diamondRank4 = new Rank({ score: 7200 });
        const diamondRank3 = new Rank({ score: 7900 });
        const diamondRank2 = new Rank({ score: 8600 });
        const diamondRank1 = new Rank({ score: 9300 });

        // Act
        const nextDiamondRank4 = new RankNext(diamondRank4);
        const nextDiamondRank3 = new RankNext(diamondRank3);
        const nextDiamondRank2 = new RankNext(diamondRank2);
        const nextDiamondRank1 = new RankNext(diamondRank1);

        // Assert
        expect(nextDiamondRank4.tierDivisionMinScore).withContext(`nextDiamondRank4`).toBe(7900);
        expect(nextDiamondRank4.tierName).withContext(`nextDiamondRank4`).toBe(RankTierName.Diamond);
        expect(nextDiamondRank4.tierDivision).withContext(`nextDiamondRank4`).toBe(RankTierDivisionMap[3]);
        expect(nextDiamondRank3.tierDivisionMinScore).withContext(`nextDiamondRank3`).toBe(8600);
        expect(nextDiamondRank3.tierName).withContext(`nextDiamondRank3`).toBe(RankTierName.Diamond);
        expect(nextDiamondRank3.tierDivision).withContext(`nextDiamondRank3`).toBe(RankTierDivisionMap[2]);
        expect(nextDiamondRank2.tierDivisionMinScore).withContext(`nextDiamondRank2`).toBe(9300);
        expect(nextDiamondRank2.tierName).withContext(`nextDiamondRank2`).toBe(RankTierName.Diamond);
        expect(nextDiamondRank2.tierDivision).withContext(`nextDiamondRank2`).toBe(RankTierDivisionMap[1]);
        expect(nextDiamondRank1.tierDivisionMinScore).withContext(`nextDiamondRank1`).toBe(10000);
        expect(nextDiamondRank1.tierName).withContext(`nextDiamondRank1`).toBe(RankTierName.Master);
        expect(nextDiamondRank1.tierDivision).withContext(`nextDiamondRank1`).toBe(RankTierDivisionMap[0]);
    });

    it("should be created from Master Rank class", () => {
        // Arrange
        const masterRank = new Rank({ score: 10000 });

        // Act
        const nextMasterRank = new RankNext(masterRank);

        // Assert
        expect(nextMasterRank.tierDivisionMinScore).withContext(`nextMasterRank`).toBe(Infinity);
        expect(nextMasterRank.tierName).withContext(`nextMasterRank`).toBe(RankTierName.ApexPredator);
        expect(nextMasterRank.tierDivision).withContext(`nextMasterRank`).toBe(RankTierDivisionMap[0]);
    });

    it("should be created from Apex Predator Rank class", () => {
        // Arrange
        const apexPredatorRank = new Rank({ score: Infinity });

        // Act
        const nextApexPredatorRank = new RankNext(apexPredatorRank);

        // Assert
        expect(nextApexPredatorRank.tierDivisionMinScore).withContext(`nextMasterRank`).toBe(Infinity);
        expect(nextApexPredatorRank.tierName).withContext(`nextMasterRank`).toBe(RankTierName.ApexPredator);
        expect(nextApexPredatorRank.tierDivision).withContext(`nextMasterRank`).toBe(RankTierDivisionMap[0]);
    });
    //#endregion

    //#region From Score
    it("should be created from Bronze Rank score", () => {
        // Arrange
        const bronzeRank4Score = 0;
        const bronzeRank3Score = 300;
        const bronzeRank2Score = 600;
        const bronzeRank1Score = 900;

        // Act
        const nextBronzeRank4 = new RankNext(bronzeRank4Score);
        const nextBronzeRank3 = new RankNext(bronzeRank3Score);
        const nextBronzeRank2 = new RankNext(bronzeRank2Score);
        const nextBronzeRank1 = new RankNext(bronzeRank1Score);

        // Assert
        expect(nextBronzeRank4.tierDivisionMinScore).withContext(`nextBronzeRank4`).toBe(300);
        expect(nextBronzeRank4.tierName).withContext(`nextBronzeRank4`).toBe(RankTierName.Bronze);
        expect(nextBronzeRank4.tierDivision).withContext(`nextBronzeRank4`).toBe(RankTierDivisionMap[3]);
        expect(nextBronzeRank3.tierDivisionMinScore).withContext(`nextBronzeRank3`).toBe(600);
        expect(nextBronzeRank3.tierName).withContext(`nextBronzeRank3`).toBe(RankTierName.Bronze);
        expect(nextBronzeRank3.tierDivision).withContext(`nextBronzeRank3`).toBe(RankTierDivisionMap[2]);
        expect(nextBronzeRank2.tierDivisionMinScore).withContext(`nextBronzeRank2`).toBe(900);
        expect(nextBronzeRank2.tierName).withContext(`nextBronzeRank2`).toBe(RankTierName.Bronze);
        expect(nextBronzeRank2.tierDivision).withContext(`nextBronzeRank2`).toBe(RankTierDivisionMap[1]);
        expect(nextBronzeRank1.tierDivisionMinScore).withContext(`nextBronzeRank1`).toBe(1200);
        expect(nextBronzeRank1.tierName).withContext(`nextBronzeRank1`).toBe(RankTierName.Silver);
        expect(nextBronzeRank1.tierDivision).withContext(`nextBronzeRank1`).toBe(RankTierDivisionMap[4]);
    });

    it("should be created from Silver Rank score", () => {
        // Arrange
        const silverRank4Score = 1200;
        const silverRank3Score = 1600;
        const silverRank2Score = 2000;
        const silverRank1Score = 2400;

        // Act
        const nextSilverRank4 = new RankNext(silverRank4Score);
        const nextSilverRank3 = new RankNext(silverRank3Score);
        const nextSilverRank2 = new RankNext(silverRank2Score);
        const nextSilverRank1 = new RankNext(silverRank1Score);

        // Assert
        expect(nextSilverRank4.tierDivisionMinScore).withContext(`nextSilverRank4`).toBe(1600);
        expect(nextSilverRank4.tierName).withContext(`nextSilverRank4`).toBe(RankTierName.Silver);
        expect(nextSilverRank4.tierDivision).withContext(`nextSilverRank4`).toBe(RankTierDivisionMap[3]);
        expect(nextSilverRank3.tierDivisionMinScore).withContext(`nextSilverRank3`).toBe(2000);
        expect(nextSilverRank3.tierName).withContext(`nextSilverRank3`).toBe(RankTierName.Silver);
        expect(nextSilverRank3.tierDivision).withContext(`nextSilverRank3`).toBe(RankTierDivisionMap[2]);
        expect(nextSilverRank2.tierDivisionMinScore).withContext(`nextSilverRank2`).toBe(2400);
        expect(nextSilverRank2.tierName).withContext(`nextSilverRank2`).toBe(RankTierName.Silver);
        expect(nextSilverRank2.tierDivision).withContext(`nextSilverRank2`).toBe(RankTierDivisionMap[1]);
        expect(nextSilverRank1.tierDivisionMinScore).withContext(`nextSilverRank1`).toBe(2800);
        expect(nextSilverRank1.tierName).withContext(`nextSilverRank1`).toBe(RankTierName.Gold);
        expect(nextSilverRank1.tierDivision).withContext(`nextSilverRank1`).toBe(RankTierDivisionMap[4]);
    });

    it("should be created from Gold Rank score", () => {
        // Arrange
        const goldRank4Score = 2800;
        const goldRank3Score = 3300;
        const goldRank2Score = 3800;
        const goldRank1Score = 4300;

        // Act
        const nextGoldRank4 = new RankNext(goldRank4Score);
        const nextGoldRank3 = new RankNext(goldRank3Score);
        const nextGoldRank2 = new RankNext(goldRank2Score);
        const nextGoldRank1 = new RankNext(goldRank1Score);

        // Assert
        expect(nextGoldRank4.tierDivisionMinScore).withContext(`nextGoldRank4`).toBe(3300);
        expect(nextGoldRank4.tierName).withContext(`nextGoldRank4`).toBe(RankTierName.Gold);
        expect(nextGoldRank4.tierDivision).withContext(`nextGoldRank4`).toBe(RankTierDivisionMap[3]);
        expect(nextGoldRank3.tierDivisionMinScore).withContext(`nextGoldRank3`).toBe(3800);
        expect(nextGoldRank3.tierName).withContext(`nextGoldRank3`).toBe(RankTierName.Gold);
        expect(nextGoldRank3.tierDivision).withContext(`nextGoldRank3`).toBe(RankTierDivisionMap[2]);
        expect(nextGoldRank2.tierDivisionMinScore).withContext(`nextGoldRank2`).toBe(4300);
        expect(nextGoldRank2.tierName).withContext(`nextGoldRank2`).toBe(RankTierName.Gold);
        expect(nextGoldRank2.tierDivision).withContext(`nextGoldRank2`).toBe(RankTierDivisionMap[1]);
        expect(nextGoldRank1.tierDivisionMinScore).withContext(`nextGoldRank1`).toBe(4800);
        expect(nextGoldRank1.tierName).withContext(`nextGoldRank1`).toBe(RankTierName.Platinum);
        expect(nextGoldRank1.tierDivision).withContext(`nextGoldRank1`).toBe(RankTierDivisionMap[4]);
    });

    it("should be created from Platinum Rank score", () => {
        // Arrange
        const platinumRank4Score = 4800;
        const platinumRank3Score = 5400;
        const platinumRank2Score = 6000;
        const platinumRank1Score = 6600;

        // Act
        const nextPlatinumRank4 = new RankNext(platinumRank4Score);
        const nextPlatinumRank3 = new RankNext(platinumRank3Score);
        const nextPlatinumRank2 = new RankNext(platinumRank2Score);
        const nextPlatinumRank1 = new RankNext(platinumRank1Score);

        // Assert
        expect(nextPlatinumRank4.tierDivisionMinScore).withContext(`nextPlatinumRank4`).toBe(5400);
        expect(nextPlatinumRank4.tierName).withContext(`nextPlatinumRank4`).toBe(RankTierName.Platinum);
        expect(nextPlatinumRank4.tierDivision).withContext(`nextPlatinumRank4`).toBe(RankTierDivisionMap[3]);
        expect(nextPlatinumRank3.tierDivisionMinScore).withContext(`nextPlatinumRank3`).toBe(6000);
        expect(nextPlatinumRank3.tierName).withContext(`nextPlatinumRank3`).toBe(RankTierName.Platinum);
        expect(nextPlatinumRank3.tierDivision).withContext(`nextPlatinumRank3`).toBe(RankTierDivisionMap[2]);
        expect(nextPlatinumRank2.tierDivisionMinScore).withContext(`nextPlatinumRank2`).toBe(6600);
        expect(nextPlatinumRank2.tierName).withContext(`nextPlatinumRank2`).toBe(RankTierName.Platinum);
        expect(nextPlatinumRank2.tierDivision).withContext(`nextPlatinumRank2`).toBe(RankTierDivisionMap[1]);
        expect(nextPlatinumRank1.tierDivisionMinScore).withContext(`nextPlatinumRank1`).toBe(7200);
        expect(nextPlatinumRank1.tierName).withContext(`nextPlatinumRank1`).toBe(RankTierName.Diamond);
        expect(nextPlatinumRank1.tierDivision).withContext(`nextPlatinumRank1`).toBe(RankTierDivisionMap[4]);
    });

    it("should be created from Diamond Rank score", () => {
        // Arrange
        const diamondRank4Score = 7200;
        const diamondRank3Score = 7900;
        const diamondRank2Score = 8600;
        const diamondRank1Score = 9300;

        // Act
        const nextDiamondRank4 = new RankNext(diamondRank4Score);
        const nextDiamondRank3 = new RankNext(diamondRank3Score);
        const nextDiamondRank2 = new RankNext(diamondRank2Score);
        const nextDiamondRank1 = new RankNext(diamondRank1Score);

        // Assert
        expect(nextDiamondRank4.tierDivisionMinScore).withContext(`nextDiamondRank4`).toBe(7900);
        expect(nextDiamondRank4.tierName).withContext(`nextDiamondRank4`).toBe(RankTierName.Diamond);
        expect(nextDiamondRank4.tierDivision).withContext(`nextDiamondRank4`).toBe(RankTierDivisionMap[3]);
        expect(nextDiamondRank3.tierDivisionMinScore).withContext(`nextDiamondRank3`).toBe(8600);
        expect(nextDiamondRank3.tierName).withContext(`nextDiamondRank3`).toBe(RankTierName.Diamond);
        expect(nextDiamondRank3.tierDivision).withContext(`nextDiamondRank3`).toBe(RankTierDivisionMap[2]);
        expect(nextDiamondRank2.tierDivisionMinScore).withContext(`nextDiamondRank2`).toBe(9300);
        expect(nextDiamondRank2.tierName).withContext(`nextDiamondRank2`).toBe(RankTierName.Diamond);
        expect(nextDiamondRank2.tierDivision).withContext(`nextDiamondRank2`).toBe(RankTierDivisionMap[1]);
        expect(nextDiamondRank1.tierDivisionMinScore).withContext(`nextDiamondRank1`).toBe(10000);
        expect(nextDiamondRank1.tierName).withContext(`nextDiamondRank1`).toBe(RankTierName.Master);
        expect(nextDiamondRank1.tierDivision).withContext(`nextDiamondRank1`).toBe(RankTierDivisionMap[0]);
    });

    it("should be created from Master Rank score", () => {
        // Arrange
        const masterRankScore = 10000;

        // Act
        const nextMasterRank = new RankNext(masterRankScore);

        // Assert
        expect(nextMasterRank.tierDivisionMinScore).withContext(`nextMasterRank`).toBe(Infinity);
        expect(nextMasterRank.tierName).withContext(`nextMasterRank`).toBe(RankTierName.ApexPredator);
        expect(nextMasterRank.tierDivision).withContext(`nextMasterRank`).toBe(RankTierDivisionMap[0]);
    });

    it("should be created from Apex Predator Rank score", () => {
        // Arrange
        const apexPredatorRankScore = Infinity;

        // Act
        const nextApexPredatorRank = new RankNext(apexPredatorRankScore);

        // Assert
        expect(nextApexPredatorRank.tierDivisionMinScore).withContext(`nextMasterRank`).toBe(Infinity);
        expect(nextApexPredatorRank.tierName).withContext(`nextMasterRank`).toBe(RankTierName.ApexPredator);
        expect(nextApexPredatorRank.tierDivision).withContext(`nextMasterRank`).toBe(RankTierDivisionMap[0]);
    });
    //#endregion
});
