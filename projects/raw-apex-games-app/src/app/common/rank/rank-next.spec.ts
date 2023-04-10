import { Rank, RankTierDivisionMap, RankTierName } from "./rank";
import { RankNext } from "./rank-next";

describe("RankNext", () => {
    describe("computed properties", () => {
        it("should compute friendlyName", () => {
            // Arrange / Act
            const rookie4RankNext = new RankNext(0);
            const bronze4RankNext = new RankNext(1000);
            const silver4RankNext = new RankNext(3000);
            const gold4RankNext = new RankNext(5400);
            const platinum4RankNext = new RankNext(8200);
            const diamond4RankNext = new RankNext(11400);
            const masterRankNext = new RankNext(15000);

            // Assert
            expect(rookie4RankNext.friendlyName).withContext(`rookie4RankNext`).toBe("Rookie III");
            expect(bronze4RankNext.friendlyName).withContext(`bronze4RankNext`).toBe("Bronze III");
            expect(silver4RankNext.friendlyName).withContext(`silver4RankNext`).toBe("Silver III");
            expect(gold4RankNext.friendlyName).withContext(`gold4RankNext`).toBe("Gold III");
            expect(platinum4RankNext.friendlyName).withContext(`platinum4RankNext`).toBe("Platinum III");
            expect(diamond4RankNext.friendlyName).withContext(`diamond4RankNext`).toBe("Diamond III");
            expect(masterRankNext.friendlyName).withContext(`masterRankNext`).toBe("Apex Predator");
        });

        it("should compute tierDivisionMinScore", () => {
            // Arrange / Act
            const rookie4RankNext = new RankNext(0);
            const bronze4RankNext = new RankNext(1000);
            const silver4RankNext = new RankNext(3000);
            const gold4RankNext = new RankNext(5400);
            const platinum4RankNext = new RankNext(8200);
            const diamond4RankNext = new RankNext(11400);
            const masterRankNext = new RankNext(15000);

            // Assert
            expect(rookie4RankNext.tierDivisionMinScore).withContext(`rookie4RankNext`).toBe(250);
            expect(bronze4RankNext.tierDivisionMinScore).withContext(`bronze4RankNext`).toBe(1500);
            expect(silver4RankNext.tierDivisionMinScore).withContext(`silver4RankNext`).toBe(3600);
            expect(gold4RankNext.tierDivisionMinScore).withContext(`gold4RankNext`).toBe(6100);
            expect(platinum4RankNext.tierDivisionMinScore).withContext(`platinum4RankNext`).toBe(9000);
            expect(diamond4RankNext.tierDivisionMinScore).withContext(`diamond4RankNext`).toBe(12300);
            expect(masterRankNext.tierDivisionMinScore).withContext(`masterRankNext`).toBe(Infinity);
        });

        it("should compute tierName", () => {
            // Arrange / Act
            const rookie1RankNext = new RankNext(999);
            const bronze1RankNext = new RankNext(2999);
            const silver1RankNext = new RankNext(5399);
            const gold1RankNext = new RankNext(8199);
            const platinum1RankNext = new RankNext(11399);
            const diamond1RankNext = new RankNext(14999);
            const masterRankNext = new RankNext(15000);

            // Assert
            expect(rookie1RankNext.tierName).withContext(`rookie1RankNext`).toBe("Bronze");
            expect(bronze1RankNext.tierName).withContext(`bronze1RankNext`).toBe("Silver");
            expect(silver1RankNext.tierName).withContext(`silver1RankNext`).toBe("Gold");
            expect(gold1RankNext.tierName).withContext(`gold1RankNext`).toBe("Platinum");
            expect(platinum1RankNext.tierName).withContext(`platinum1RankNext`).toBe("Diamond");
            expect(diamond1RankNext.tierName).withContext(`diamond1RankNext`).toBe("Master");
            expect(masterRankNext.tierName).withContext(`masterRank`).toBe("Apex Predator");
        });

        it("should compute tierDivision", () => {
            // Arrange / Act
            const rookie4RankNext = new RankNext(0);
            const bronze4RankNext = new RankNext(1000);
            const silver4RankNext = new RankNext(3000);
            const gold4RankNext = new RankNext(5400);
            const platinum4RankNext = new RankNext(8200);
            const diamond4RankNext = new RankNext(11400);
            const masterRankNext = new RankNext(15000);

            // Assert
            expect(rookie4RankNext.tierDivision).withContext(`rookie4RankNext`).toBe(RankTierDivisionMap[3]);
            expect(bronze4RankNext.tierDivision).withContext(`bronze4RankNext`).toBe(RankTierDivisionMap[3]);
            expect(silver4RankNext.tierDivision).withContext(`silver4RankNext`).toBe(RankTierDivisionMap[3]);
            expect(gold4RankNext.tierDivision).withContext(`gold4RankNext`).toBe(RankTierDivisionMap[3]);
            expect(platinum4RankNext.tierDivision).withContext(`platinum4RankNext`).toBe(RankTierDivisionMap[3]);
            expect(diamond4RankNext.tierDivision).withContext(`diamond4RankNext`).toBe(RankTierDivisionMap[3]);
            expect(masterRankNext.tierDivision).withContext(`masterRank`).toBe(RankTierDivisionMap[0]);
        });

        it("should compute tierDivisionDistance", () => {
            // Arrange / Act
            const rookie4RankNext = new RankNext(0);
            const bronze4RankNext = new RankNext(1000);
            const silver4RankNext = new RankNext(3000);
            const gold4RankNext = new RankNext(5400);
            const platinum4RankNext = new RankNext(8200);
            const diamond4RankNext = new RankNext(11400);
            const masterRankNext = new RankNext(15000);

            // Assert
            expect(rookie4RankNext.tierDivisionDistance).withContext(`rookie4RankNext`).toBe(250);
            expect(bronze4RankNext.tierDivisionDistance).withContext(`bronze4RankNext`).toBe(500);
            expect(silver4RankNext.tierDivisionDistance).withContext(`silver4RankNext`).toBe(600);
            expect(gold4RankNext.tierDivisionDistance).withContext(`gold4RankNext`).toBe(700);
            expect(platinum4RankNext.tierDivisionDistance).withContext(`platinum4RankNext`).toBe(800);
            expect(diamond4RankNext.tierDivisionDistance).withContext(`diamond4RankNext`).toBe(900);
            expect(masterRankNext.tierDivisionDistance).withContext(`masterRank`).toBe(0);
        });

        it("should compute tierDivisionProgressPercent", () => {
            // Arrange / Act
            const rookie4RankNext = new RankNext(25);
            const bronze4RankNext = new RankNext(1050);
            const silver4RankNext = new RankNext(3120);
            const gold4RankNext = new RankNext(5610);
            const platinum4RankNext = new RankNext(8520);
            const diamond4RankNext = new RankNext(11850);
            const masterRankNext = new RankNext(15000);

            // Assert
            expect(rookie4RankNext.tierDivisionProgressPercent).withContext(`rookie4RankNext`).toBe(0.1);
            expect(bronze4RankNext.tierDivisionProgressPercent).withContext(`bronze4RankNext`).toBe(0.1);
            expect(silver4RankNext.tierDivisionProgressPercent).withContext(`silver4RankNext`).toBe(0.2);
            expect(gold4RankNext.tierDivisionProgressPercent).withContext(`gold4RankNext`).toBe(0.3);
            expect(platinum4RankNext.tierDivisionProgressPercent).withContext(`platinum4RankNext`).toBe(0.4);
            expect(diamond4RankNext.tierDivisionProgressPercent).withContext(`diamond4RankNext`).toBe(0.5);
            expect(masterRankNext.tierDivisionProgressPercent).withContext(`masterRank`).toBe(0);
        });
    });

    //#region From Class
    it("should be created from rookie Rank class", () => {
        // Arrange
        const rookieRank4 = new Rank({ score: 0 });
        const rookieRank3 = new Rank({ score: 250 });
        const rookieRank2 = new Rank({ score: 500 });
        const rookieRank1 = new Rank({ score: 750 });

        // Act
        const nextRookieRank4 = new RankNext(rookieRank4);
        const nextRookieRank3 = new RankNext(rookieRank3);
        const nextRookieRank2 = new RankNext(rookieRank2);
        const nextRookieRank1 = new RankNext(rookieRank1);

        // Assert
        expect(nextRookieRank4.tierDivisionMinScore).withContext(`nextRookieRank4`).toBe(250);
        expect(nextRookieRank4.tierName).withContext(`nextRookieRank4`).toBe(RankTierName.Rookie);
        expect(nextRookieRank4.tierDivision).withContext(`nextRookieRank4`).toBe(RankTierDivisionMap[3]);
        expect(nextRookieRank3.tierDivisionMinScore).withContext(`nextRookieRank3`).toBe(500);
        expect(nextRookieRank3.tierName).withContext(`nextRookieRank3`).toBe(RankTierName.Rookie);
        expect(nextRookieRank3.tierDivision).withContext(`nextRookieRank3`).toBe(RankTierDivisionMap[2]);
        expect(nextRookieRank2.tierDivisionMinScore).withContext(`nextRookieRank2`).toBe(750);
        expect(nextRookieRank2.tierName).withContext(`nextRookieRank2`).toBe(RankTierName.Rookie);
        expect(nextRookieRank2.tierDivision).withContext(`nextRookieRank2`).toBe(RankTierDivisionMap[1]);
        expect(nextRookieRank1.tierDivisionMinScore).withContext(`nextRookieRank1`).toBe(1000);
        expect(nextRookieRank1.tierName).withContext(`nextRookieRank1`).toBe(RankTierName.Bronze);
        expect(nextRookieRank1.tierDivision).withContext(`nextRookieRank1`).toBe(RankTierDivisionMap[4]);
    });

    it("should be created from Bronze Rank class", () => {
        // Arrange
        const bronzeRank4 = new Rank({ score: 1000 });
        const bronzeRank3 = new Rank({ score: 1500 });
        const bronzeRank2 = new Rank({ score: 2000 });
        const bronzeRank1 = new Rank({ score: 2500 });

        // Act
        const nextBronzeRank4 = new RankNext(bronzeRank4);
        const nextBronzeRank3 = new RankNext(bronzeRank3);
        const nextBronzeRank2 = new RankNext(bronzeRank2);
        const nextBronzeRank1 = new RankNext(bronzeRank1);

        // Assert
        expect(nextBronzeRank4.tierDivisionMinScore).withContext(`nextBronzeRank4`).toBe(1500);
        expect(nextBronzeRank4.tierName).withContext(`nextBronzeRank4`).toBe(RankTierName.Bronze);
        expect(nextBronzeRank4.tierDivision).withContext(`nextBronzeRank4`).toBe(RankTierDivisionMap[3]);
        expect(nextBronzeRank3.tierDivisionMinScore).withContext(`nextBronzeRank3`).toBe(2000);
        expect(nextBronzeRank3.tierName).withContext(`nextBronzeRank3`).toBe(RankTierName.Bronze);
        expect(nextBronzeRank3.tierDivision).withContext(`nextBronzeRank3`).toBe(RankTierDivisionMap[2]);
        expect(nextBronzeRank2.tierDivisionMinScore).withContext(`nextBronzeRank2`).toBe(2500);
        expect(nextBronzeRank2.tierName).withContext(`nextBronzeRank2`).toBe(RankTierName.Bronze);
        expect(nextBronzeRank2.tierDivision).withContext(`nextBronzeRank2`).toBe(RankTierDivisionMap[1]);
        expect(nextBronzeRank1.tierDivisionMinScore).withContext(`nextBronzeRank1`).toBe(3000);
        expect(nextBronzeRank1.tierName).withContext(`nextBronzeRank1`).toBe(RankTierName.Silver);
        expect(nextBronzeRank1.tierDivision).withContext(`nextBronzeRank1`).toBe(RankTierDivisionMap[4]);
    });

    it("should be created from Silver Rank class", () => {
        // Arrange
        const silverRank4 = new Rank({ score: 3000 });
        const silverRank3 = new Rank({ score: 3600 });
        const silverRank2 = new Rank({ score: 4200 });
        const silverRank1 = new Rank({ score: 4800 });

        // Act
        const nextSilverRank4 = new RankNext(silverRank4);
        const nextSilverRank3 = new RankNext(silverRank3);
        const nextSilverRank2 = new RankNext(silverRank2);
        const nextSilverRank1 = new RankNext(silverRank1);

        // Assert
        expect(nextSilverRank4.tierDivisionMinScore).withContext(`nextSilverRank4`).toBe(3600);
        expect(nextSilverRank4.tierName).withContext(`nextSilverRank4`).toBe(RankTierName.Silver);
        expect(nextSilverRank4.tierDivision).withContext(`nextSilverRank4`).toBe(RankTierDivisionMap[3]);
        expect(nextSilverRank3.tierDivisionMinScore).withContext(`nextSilverRank3`).toBe(4200);
        expect(nextSilverRank3.tierName).withContext(`nextSilverRank3`).toBe(RankTierName.Silver);
        expect(nextSilverRank3.tierDivision).withContext(`nextSilverRank3`).toBe(RankTierDivisionMap[2]);
        expect(nextSilverRank2.tierDivisionMinScore).withContext(`nextSilverRank2`).toBe(4800);
        expect(nextSilverRank2.tierName).withContext(`nextSilverRank2`).toBe(RankTierName.Silver);
        expect(nextSilverRank2.tierDivision).withContext(`nextSilverRank2`).toBe(RankTierDivisionMap[1]);
        expect(nextSilverRank1.tierDivisionMinScore).withContext(`nextSilverRank1`).toBe(5400);
        expect(nextSilverRank1.tierName).withContext(`nextSilverRank1`).toBe(RankTierName.Gold);
        expect(nextSilverRank1.tierDivision).withContext(`nextSilverRank1`).toBe(RankTierDivisionMap[4]);
    });

    it("should be created from Gold Rank class", () => {
        // Arrange
        const goldRank4 = new Rank({ score: 5400 });
        const goldRank3 = new Rank({ score: 6100 });
        const goldRank2 = new Rank({ score: 6800 });
        const goldRank1 = new Rank({ score: 7500 });

        // Act
        const nextGoldRank4 = new RankNext(goldRank4);
        const nextGoldRank3 = new RankNext(goldRank3);
        const nextGoldRank2 = new RankNext(goldRank2);
        const nextGoldRank1 = new RankNext(goldRank1);

        // Assert
        expect(nextGoldRank4.tierDivisionMinScore).withContext(`nextGoldRank4`).toBe(6100);
        expect(nextGoldRank4.tierName).withContext(`nextGoldRank4`).toBe(RankTierName.Gold);
        expect(nextGoldRank4.tierDivision).withContext(`nextGoldRank4`).toBe(RankTierDivisionMap[3]);
        expect(nextGoldRank3.tierDivisionMinScore).withContext(`nextGoldRank3`).toBe(6800);
        expect(nextGoldRank3.tierName).withContext(`nextGoldRank3`).toBe(RankTierName.Gold);
        expect(nextGoldRank3.tierDivision).withContext(`nextGoldRank3`).toBe(RankTierDivisionMap[2]);
        expect(nextGoldRank2.tierDivisionMinScore).withContext(`nextGoldRank2`).toBe(7500);
        expect(nextGoldRank2.tierName).withContext(`nextGoldRank2`).toBe(RankTierName.Gold);
        expect(nextGoldRank2.tierDivision).withContext(`nextGoldRank2`).toBe(RankTierDivisionMap[1]);
        expect(nextGoldRank1.tierDivisionMinScore).withContext(`nextGoldRank1`).toBe(8200);
        expect(nextGoldRank1.tierName).withContext(`nextGoldRank1`).toBe(RankTierName.Platinum);
        expect(nextGoldRank1.tierDivision).withContext(`nextGoldRank1`).toBe(RankTierDivisionMap[4]);
    });

    it("should be created from Platinum Rank class", () => {
        // Arrange
        const platinumRank4 = new Rank({ score: 8200 });
        const platinumRank3 = new Rank({ score: 9000 });
        const platinumRank2 = new Rank({ score: 9800 });
        const platinumRank1 = new Rank({ score: 10600 });

        // Act
        const nextPlatinumRank4 = new RankNext(platinumRank4);
        const nextPlatinumRank3 = new RankNext(platinumRank3);
        const nextPlatinumRank2 = new RankNext(platinumRank2);
        const nextPlatinumRank1 = new RankNext(platinumRank1);

        // Assert
        expect(nextPlatinumRank4.tierDivisionMinScore).withContext(`nextPlatinumRank4`).toBe(9000);
        expect(nextPlatinumRank4.tierName).withContext(`nextPlatinumRank4`).toBe(RankTierName.Platinum);
        expect(nextPlatinumRank4.tierDivision).withContext(`nextPlatinumRank4`).toBe(RankTierDivisionMap[3]);
        expect(nextPlatinumRank3.tierDivisionMinScore).withContext(`nextPlatinumRank3`).toBe(9800);
        expect(nextPlatinumRank3.tierName).withContext(`nextPlatinumRank3`).toBe(RankTierName.Platinum);
        expect(nextPlatinumRank3.tierDivision).withContext(`nextPlatinumRank3`).toBe(RankTierDivisionMap[2]);
        expect(nextPlatinumRank2.tierDivisionMinScore).withContext(`nextPlatinumRank2`).toBe(10600);
        expect(nextPlatinumRank2.tierName).withContext(`nextPlatinumRank2`).toBe(RankTierName.Platinum);
        expect(nextPlatinumRank2.tierDivision).withContext(`nextPlatinumRank2`).toBe(RankTierDivisionMap[1]);
        expect(nextPlatinumRank1.tierDivisionMinScore).withContext(`nextPlatinumRank1`).toBe(11400);
        expect(nextPlatinumRank1.tierName).withContext(`nextPlatinumRank1`).toBe(RankTierName.Diamond);
        expect(nextPlatinumRank1.tierDivision).withContext(`nextPlatinumRank1`).toBe(RankTierDivisionMap[4]);
    });

    it("should be created from Diamond Rank class", () => {
        // Arrange
        const diamondRank4 = new Rank({ score: 11400 });
        const diamondRank3 = new Rank({ score: 12300 });
        const diamondRank2 = new Rank({ score: 13200 });
        const diamondRank1 = new Rank({ score: 14100 });

        // Act
        const nextDiamondRank4 = new RankNext(diamondRank4);
        const nextDiamondRank3 = new RankNext(diamondRank3);
        const nextDiamondRank2 = new RankNext(diamondRank2);
        const nextDiamondRank1 = new RankNext(diamondRank1);

        // Assert
        expect(nextDiamondRank4.tierDivisionMinScore).withContext(`nextDiamondRank4`).toBe(12300);
        expect(nextDiamondRank4.tierName).withContext(`nextDiamondRank4`).toBe(RankTierName.Diamond);
        expect(nextDiamondRank4.tierDivision).withContext(`nextDiamondRank4`).toBe(RankTierDivisionMap[3]);
        expect(nextDiamondRank3.tierDivisionMinScore).withContext(`nextDiamondRank3`).toBe(13200);
        expect(nextDiamondRank3.tierName).withContext(`nextDiamondRank3`).toBe(RankTierName.Diamond);
        expect(nextDiamondRank3.tierDivision).withContext(`nextDiamondRank3`).toBe(RankTierDivisionMap[2]);
        expect(nextDiamondRank2.tierDivisionMinScore).withContext(`nextDiamondRank2`).toBe(14100);
        expect(nextDiamondRank2.tierName).withContext(`nextDiamondRank2`).toBe(RankTierName.Diamond);
        expect(nextDiamondRank2.tierDivision).withContext(`nextDiamondRank2`).toBe(RankTierDivisionMap[1]);
        expect(nextDiamondRank1.tierDivisionMinScore).withContext(`nextDiamondRank1`).toBe(15000);
        expect(nextDiamondRank1.tierName).withContext(`nextDiamondRank1`).toBe(RankTierName.Master);
        expect(nextDiamondRank1.tierDivision).withContext(`nextDiamondRank1`).toBe(RankTierDivisionMap[0]);
    });

    it("should be created from Master Rank class", () => {
        // Arrange
        const masterRank = new Rank({ score: 15000 });

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
    it("should be created from rookie Rank score", () => {
        // Arrange
        const rookieRank4Score = 0;
        const rookieRank3Score = 250;
        const rookieRank2Score = 500;
        const rookieRank1Score = 750;

        // Act
        const nextRookieRank4 = new RankNext(rookieRank4Score);
        const nextRookieRank3 = new RankNext(rookieRank3Score);
        const nextRookieRank2 = new RankNext(rookieRank2Score);
        const nextRookieRank1 = new RankNext(rookieRank1Score);

        // Assert
        expect(nextRookieRank4.tierDivisionMinScore).withContext(`nextRookieRank4`).toBe(250);
        expect(nextRookieRank4.tierName).withContext(`nextRookieRank4`).toBe(RankTierName.Rookie);
        expect(nextRookieRank4.tierDivision).withContext(`nextRookieRank4`).toBe(RankTierDivisionMap[3]);
        expect(nextRookieRank3.tierDivisionMinScore).withContext(`nextRookieRank3`).toBe(500);
        expect(nextRookieRank3.tierName).withContext(`nextRookieRank3`).toBe(RankTierName.Rookie);
        expect(nextRookieRank3.tierDivision).withContext(`nextRookieRank3`).toBe(RankTierDivisionMap[2]);
        expect(nextRookieRank2.tierDivisionMinScore).withContext(`nextRookieRank2`).toBe(750);
        expect(nextRookieRank2.tierName).withContext(`nextRookieRank2`).toBe(RankTierName.Rookie);
        expect(nextRookieRank2.tierDivision).withContext(`nextRookieRank2`).toBe(RankTierDivisionMap[1]);
        expect(nextRookieRank1.tierDivisionMinScore).withContext(`nextRookieRank1`).toBe(1000);
        expect(nextRookieRank1.tierName).withContext(`nextRookieRank1`).toBe(RankTierName.Bronze);
        expect(nextRookieRank1.tierDivision).withContext(`nextRookieRank1`).toBe(RankTierDivisionMap[4]);
    });

    //#region From Score
    it("should be created from Bronze Rank score", () => {
        // Arrange
        const bronzeRank4Score = 1000;
        const bronzeRank3Score = 1500;
        const bronzeRank2Score = 2000;
        const bronzeRank1Score = 2500;

        // Act
        const nextBronzeRank4 = new RankNext(bronzeRank4Score);
        const nextBronzeRank3 = new RankNext(bronzeRank3Score);
        const nextBronzeRank2 = new RankNext(bronzeRank2Score);
        const nextBronzeRank1 = new RankNext(bronzeRank1Score);

        // Assert
        expect(nextBronzeRank4.tierDivisionMinScore).withContext(`nextBronzeRank4`).toBe(1500);
        expect(nextBronzeRank4.tierName).withContext(`nextBronzeRank4`).toBe(RankTierName.Bronze);
        expect(nextBronzeRank4.tierDivision).withContext(`nextBronzeRank4`).toBe(RankTierDivisionMap[3]);
        expect(nextBronzeRank3.tierDivisionMinScore).withContext(`nextBronzeRank3`).toBe(2000);
        expect(nextBronzeRank3.tierName).withContext(`nextBronzeRank3`).toBe(RankTierName.Bronze);
        expect(nextBronzeRank3.tierDivision).withContext(`nextBronzeRank3`).toBe(RankTierDivisionMap[2]);
        expect(nextBronzeRank2.tierDivisionMinScore).withContext(`nextBronzeRank2`).toBe(2500);
        expect(nextBronzeRank2.tierName).withContext(`nextBronzeRank2`).toBe(RankTierName.Bronze);
        expect(nextBronzeRank2.tierDivision).withContext(`nextBronzeRank2`).toBe(RankTierDivisionMap[1]);
        expect(nextBronzeRank1.tierDivisionMinScore).withContext(`nextBronzeRank1`).toBe(3000);
        expect(nextBronzeRank1.tierName).withContext(`nextBronzeRank1`).toBe(RankTierName.Silver);
        expect(nextBronzeRank1.tierDivision).withContext(`nextBronzeRank1`).toBe(RankTierDivisionMap[4]);
    });

    it("should be created from Silver Rank score", () => {
        // Arrange
        const silverRank4Score = 3000;
        const silverRank3Score = 3600;
        const silverRank2Score = 4200;
        const silverRank1Score = 4800;

        // Act
        const nextSilverRank4 = new RankNext(silverRank4Score);
        const nextSilverRank3 = new RankNext(silverRank3Score);
        const nextSilverRank2 = new RankNext(silverRank2Score);
        const nextSilverRank1 = new RankNext(silverRank1Score);

        // Assert
        expect(nextSilverRank4.tierDivisionMinScore).withContext(`nextSilverRank4`).toBe(3600);
        expect(nextSilverRank4.tierName).withContext(`nextSilverRank4`).toBe(RankTierName.Silver);
        expect(nextSilverRank4.tierDivision).withContext(`nextSilverRank4`).toBe(RankTierDivisionMap[3]);
        expect(nextSilverRank3.tierDivisionMinScore).withContext(`nextSilverRank3`).toBe(4200);
        expect(nextSilverRank3.tierName).withContext(`nextSilverRank3`).toBe(RankTierName.Silver);
        expect(nextSilverRank3.tierDivision).withContext(`nextSilverRank3`).toBe(RankTierDivisionMap[2]);
        expect(nextSilverRank2.tierDivisionMinScore).withContext(`nextSilverRank2`).toBe(4800);
        expect(nextSilverRank2.tierName).withContext(`nextSilverRank2`).toBe(RankTierName.Silver);
        expect(nextSilverRank2.tierDivision).withContext(`nextSilverRank2`).toBe(RankTierDivisionMap[1]);
        expect(nextSilverRank1.tierDivisionMinScore).withContext(`nextSilverRank1`).toBe(5400);
        expect(nextSilverRank1.tierName).withContext(`nextSilverRank1`).toBe(RankTierName.Gold);
        expect(nextSilverRank1.tierDivision).withContext(`nextSilverRank1`).toBe(RankTierDivisionMap[4]);
    });

    it("should be created from Gold Rank score", () => {
        // Arrange
        const goldRank4Score = 5400;
        const goldRank3Score = 6100;
        const goldRank2Score = 6800;
        const goldRank1Score = 7500;

        // Act
        const nextGoldRank4 = new RankNext(goldRank4Score);
        const nextGoldRank3 = new RankNext(goldRank3Score);
        const nextGoldRank2 = new RankNext(goldRank2Score);
        const nextGoldRank1 = new RankNext(goldRank1Score);

        // Assert
        expect(nextGoldRank4.tierDivisionMinScore).withContext(`nextGoldRank4`).toBe(6100);
        expect(nextGoldRank4.tierName).withContext(`nextGoldRank4`).toBe(RankTierName.Gold);
        expect(nextGoldRank4.tierDivision).withContext(`nextGoldRank4`).toBe(RankTierDivisionMap[3]);
        expect(nextGoldRank3.tierDivisionMinScore).withContext(`nextGoldRank3`).toBe(6800);
        expect(nextGoldRank3.tierName).withContext(`nextGoldRank3`).toBe(RankTierName.Gold);
        expect(nextGoldRank3.tierDivision).withContext(`nextGoldRank3`).toBe(RankTierDivisionMap[2]);
        expect(nextGoldRank2.tierDivisionMinScore).withContext(`nextGoldRank2`).toBe(7500);
        expect(nextGoldRank2.tierName).withContext(`nextGoldRank2`).toBe(RankTierName.Gold);
        expect(nextGoldRank2.tierDivision).withContext(`nextGoldRank2`).toBe(RankTierDivisionMap[1]);
        expect(nextGoldRank1.tierDivisionMinScore).withContext(`nextGoldRank1`).toBe(8200);
        expect(nextGoldRank1.tierName).withContext(`nextGoldRank1`).toBe(RankTierName.Platinum);
        expect(nextGoldRank1.tierDivision).withContext(`nextGoldRank1`).toBe(RankTierDivisionMap[4]);
    });

    it("should be created from Platinum Rank score", () => {
        // Arrange
        const platinumRank4Score = 8200;
        const platinumRank3Score = 9000;
        const platinumRank2Score = 9800;
        const platinumRank1Score = 10600;

        // Act
        const nextPlatinumRank4 = new RankNext(platinumRank4Score);
        const nextPlatinumRank3 = new RankNext(platinumRank3Score);
        const nextPlatinumRank2 = new RankNext(platinumRank2Score);
        const nextPlatinumRank1 = new RankNext(platinumRank1Score);

        // Assert
        expect(nextPlatinumRank4.tierDivisionMinScore).withContext(`nextPlatinumRank4`).toBe(9000);
        expect(nextPlatinumRank4.tierName).withContext(`nextPlatinumRank4`).toBe(RankTierName.Platinum);
        expect(nextPlatinumRank4.tierDivision).withContext(`nextPlatinumRank4`).toBe(RankTierDivisionMap[3]);
        expect(nextPlatinumRank3.tierDivisionMinScore).withContext(`nextPlatinumRank3`).toBe(9800);
        expect(nextPlatinumRank3.tierName).withContext(`nextPlatinumRank3`).toBe(RankTierName.Platinum);
        expect(nextPlatinumRank3.tierDivision).withContext(`nextPlatinumRank3`).toBe(RankTierDivisionMap[2]);
        expect(nextPlatinumRank2.tierDivisionMinScore).withContext(`nextPlatinumRank2`).toBe(10600);
        expect(nextPlatinumRank2.tierName).withContext(`nextPlatinumRank2`).toBe(RankTierName.Platinum);
        expect(nextPlatinumRank2.tierDivision).withContext(`nextPlatinumRank2`).toBe(RankTierDivisionMap[1]);
        expect(nextPlatinumRank1.tierDivisionMinScore).withContext(`nextPlatinumRank1`).toBe(11400);
        expect(nextPlatinumRank1.tierName).withContext(`nextPlatinumRank1`).toBe(RankTierName.Diamond);
        expect(nextPlatinumRank1.tierDivision).withContext(`nextPlatinumRank1`).toBe(RankTierDivisionMap[4]);
    });

    it("should be created from Diamond Rank score", () => {
        // Arrange
        const diamondRank4Score = 11400;
        const diamondRank3Score = 12300;
        const diamondRank2Score = 13200;
        const diamondRank1Score = 14100;

        // Act
        const nextDiamondRank4 = new RankNext(diamondRank4Score);
        const nextDiamondRank3 = new RankNext(diamondRank3Score);
        const nextDiamondRank2 = new RankNext(diamondRank2Score);
        const nextDiamondRank1 = new RankNext(diamondRank1Score);

        // Assert
        expect(nextDiamondRank4.tierDivisionMinScore).withContext(`nextDiamondRank4`).toBe(12300);
        expect(nextDiamondRank4.tierName).withContext(`nextDiamondRank4`).toBe(RankTierName.Diamond);
        expect(nextDiamondRank4.tierDivision).withContext(`nextDiamondRank4`).toBe(RankTierDivisionMap[3]);
        expect(nextDiamondRank3.tierDivisionMinScore).withContext(`nextDiamondRank3`).toBe(13200);
        expect(nextDiamondRank3.tierName).withContext(`nextDiamondRank3`).toBe(RankTierName.Diamond);
        expect(nextDiamondRank3.tierDivision).withContext(`nextDiamondRank3`).toBe(RankTierDivisionMap[2]);
        expect(nextDiamondRank2.tierDivisionMinScore).withContext(`nextDiamondRank2`).toBe(14100);
        expect(nextDiamondRank2.tierName).withContext(`nextDiamondRank2`).toBe(RankTierName.Diamond);
        expect(nextDiamondRank2.tierDivision).withContext(`nextDiamondRank2`).toBe(RankTierDivisionMap[1]);
        expect(nextDiamondRank1.tierDivisionMinScore).withContext(`nextDiamondRank1`).toBe(15000);
        expect(nextDiamondRank1.tierName).withContext(`nextDiamondRank1`).toBe(RankTierName.Master);
        expect(nextDiamondRank1.tierDivision).withContext(`nextDiamondRank1`).toBe(RankTierDivisionMap[0]);
    });

    it("should be created from Master Rank score", () => {
        // Arrange
        const masterRankScore = 15000;

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
