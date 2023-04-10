import { TestBed } from "@angular/core/testing";
import { MatchRing } from "@raw-apex-games-app/app/common/match/ring";
import { MatchState, MatchStateChangedEvent } from "@raw-apex-games-app/app/common/match/state";
import { Configuration } from "@raw-apex-games-app/configs/config.interface";
import { addMilliseconds } from "date-fns";
import { TestScheduler } from "rxjs/testing";
import { ConfigurationService } from "../configuration.service";
import { MockConfigurationService } from "../mocks/services/mock-configuration.service";
import { MockMatchService } from "../mocks/services/mock-match.service";
import { MatchRingService } from "./match-ring.service";
import { MatchService } from "./match.service";

const MOCKALLRINGS: MatchRing[] = [
    {
        ringNumber: 1,
        holdStartTime: 65000,
        holdEndTime: 245000,
        shrinkStartTime: 248000,
        shrinkEndTime: 475000,
        damagePerTick: 2,
    },
    {
        ringNumber: 2,
        holdStartTime: 478000,
        holdEndTime: 645000,
        shrinkStartTime: 647000,
        shrinkEndTime: 717000,
        damagePerTick: 3,
    },
    {
        ringNumber: 3,
        holdStartTime: 720000,
        holdEndTime: 855000,
        shrinkStartTime: 857000,
        shrinkEndTime: 902000,
        damagePerTick: 10,
    },
    {
        ringNumber: 4,
        holdStartTime: 905000,
        holdEndTime: 1012000,
        shrinkStartTime: 1012000,
        shrinkEndTime: 1057000,
        damagePerTick: 20,
    },
    {
        ringNumber: 5,
        holdStartTime: 1060000,
        holdEndTime: 1152000,
        shrinkStartTime: 1152000,
        shrinkEndTime: 1196000,
        damagePerTick: 20,
    },
    {
        ringNumber: 6,
        holdStartTime: 1200000,
        holdEndTime: 1260000,
        shrinkStartTime: 1263000,
        shrinkEndTime: 1383000,
        damagePerTick: 25,
    },
];

const MOCKCONFIG = {
    facts: {
        maxHealth: 100,
    },
    brFacts: {
        ringDamageTickRate: 1500,
        rings: MOCKALLRINGS,
    },
} as Configuration;

describe("MatchRingService", () => {
    let sut: MatchRingService;
    let scheduler: TestScheduler;
    let configurationService: MockConfigurationService;
    let matchService: MatchService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                MatchRingService,
                { provide: ConfigurationService, useClass: MockConfigurationService },
                { provide: MatchService, useClass: MockMatchService },
            ],
        });
    });

    beforeEach(() => {
        // supressConsoleLog();
        jasmine.clock().uninstall();
        jasmine.clock().install();
        scheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
        sut = TestBed.inject(MatchRingService);
        configurationService = TestBed.inject(ConfigurationService) as unknown as MockConfigurationService;
        matchService = TestBed.inject(MatchService);
    });

    describe("allBRRings$", () => {
        it("should return all rings from config", () => {
            scheduler.run(({ expectObservable }) => {
                // Arrange
                const expectedAllBRRings = MOCKALLRINGS;

                // Act
                configurationService.mockSetConfig(MOCKCONFIG);

                // Assert
                expectObservable(sut.allBRRings$).toBe("a", { a: expectedAllBRRings });
            });
        });
    });

    describe("currentBRRing$", () => {
        it("ring 1", () => {
            scheduler.run(({ cold, expectObservable }) => {
                // Arrange
                configurationService.mockSetConfig(MOCKCONFIG);
                const startDate = new Date("2020-01-01T00:00:00");
                const firstBRRing: MatchRing = MOCKALLRINGS[0];
                const startEvent: MatchStateChangedEvent = {
                    startDate: startDate,
                    state: MatchState.Active,
                    matchId: "test",
                };

                // Act
                jasmine.clock().mockDate(startDate);
                const frame = scheduler.createTime("-|");
                cold("a-", { a: startEvent }).subscribe(matchService.startedEvent$);
                cold("a-", { a: startEvent }).subscribe(matchService.state$);
                cold("-1", {
                    1: frame * firstBRRing.holdStartTime,
                }).subscribe((tickDuration) => {
                    jasmine.clock().tick(tickDuration);
                });

                // Assert
                expectObservable(sut.currentBRRing$).toBe("u1", {
                    u: undefined,
                    1: firstBRRing,
                });
            });
        });

        it("ring 2", () => {
            scheduler.run(({ cold, expectObservable }) => {
                // Arrange
                configurationService.mockSetConfig(MOCKCONFIG);
                const startDate = new Date("2020-01-01T00:00:00");
                const firstBRRing: MatchRing = MOCKALLRINGS[0];
                const secondBRRing: MatchRing = MOCKALLRINGS[1];
                const startEvent: MatchStateChangedEvent = {
                    startDate: startDate,
                    state: MatchState.Active,
                    matchId: "test",
                };

                // Act
                jasmine.clock().mockDate(startDate);
                const frame = scheduler.createTime("-|");
                cold("a--", { a: startEvent }).subscribe(matchService.startedEvent$);
                cold("a--", { a: startEvent }).subscribe(matchService.state$);
                cold("-12", {
                    1: frame * firstBRRing.holdStartTime,
                    2: frame * (secondBRRing.holdStartTime - firstBRRing.holdStartTime),
                }).subscribe((tickDuration) => {
                    jasmine.clock().tick(tickDuration);
                });

                // Assert
                expectObservable(sut.currentBRRing$).toBe("u12", {
                    u: undefined,
                    1: firstBRRing,
                    2: secondBRRing,
                });
            });
        });

        it("ring 3", () => {
            scheduler.run(({ cold, expectObservable }) => {
                // Arrange
                configurationService.mockSetConfig(MOCKCONFIG);
                const startDate = new Date("2020-01-01T00:00:00");
                const firstBRRing: MatchRing = MOCKALLRINGS[0];
                const secondBRRing: MatchRing = MOCKALLRINGS[1];
                const thirdBRRing: MatchRing = MOCKALLRINGS[2];
                const startEvent: MatchStateChangedEvent = {
                    startDate: startDate,
                    state: MatchState.Active,
                    matchId: "test",
                };

                // Act
                jasmine.clock().mockDate(startDate);
                const frame = scheduler.createTime("-|");
                cold("a---", { a: startEvent }).subscribe(matchService.startedEvent$);
                cold("a---", { a: startEvent }).subscribe(matchService.state$);
                cold("-123", {
                    1: frame * firstBRRing.holdStartTime,
                    2: frame * (secondBRRing.holdStartTime - firstBRRing.holdStartTime),
                    3: frame * (thirdBRRing.holdStartTime - secondBRRing.holdStartTime),
                }).subscribe((tickDuration) => {
                    jasmine.clock().tick(tickDuration);
                });

                // Assert
                expectObservable(sut.currentBRRing$).toBe("u123", {
                    u: undefined,
                    1: firstBRRing,
                    2: secondBRRing,
                    3: thirdBRRing,
                });
            });
        });

        it("ring 4", () => {
            scheduler.run(({ cold, expectObservable }) => {
                // Arrange
                configurationService.mockSetConfig(MOCKCONFIG);
                const startDate = new Date("2020-01-01T00:00:00");
                const firstBRRing: MatchRing = MOCKALLRINGS[0];
                const secondBRRing: MatchRing = MOCKALLRINGS[1];
                const thirdBRRing: MatchRing = MOCKALLRINGS[2];
                const fourthBRRing: MatchRing = MOCKALLRINGS[3];
                const startEvent: MatchStateChangedEvent = {
                    startDate: startDate,
                    state: MatchState.Active,
                    matchId: "test",
                };

                // Act
                jasmine.clock().mockDate(startDate);
                const frame = scheduler.createTime("-|");
                cold("a----", { a: startEvent }).subscribe(matchService.startedEvent$);
                cold("a----", { a: startEvent }).subscribe(matchService.state$);
                cold("-1234", {
                    1: frame * firstBRRing.holdStartTime,
                    2: frame * (secondBRRing.holdStartTime - firstBRRing.holdStartTime),
                    3: frame * (thirdBRRing.holdStartTime - secondBRRing.holdStartTime),
                    4: frame * (fourthBRRing.holdStartTime - thirdBRRing.holdStartTime),
                }).subscribe((tickDuration) => {
                    jasmine.clock().tick(tickDuration);
                });

                // Assert
                expectObservable(sut.currentBRRing$).toBe("u1234", {
                    u: undefined,
                    1: firstBRRing,
                    2: secondBRRing,
                    3: thirdBRRing,
                    4: fourthBRRing,
                });
            });
        });

        it("ring 5", () => {
            scheduler.run(({ cold, expectObservable }) => {
                // Arrange
                configurationService.mockSetConfig(MOCKCONFIG);
                const startDate = new Date("2020-01-01T00:00:00");
                const firstBRRing: MatchRing = MOCKALLRINGS[0];
                const secondBRRing: MatchRing = MOCKALLRINGS[1];
                const thirdBRRing: MatchRing = MOCKALLRINGS[2];
                const fourthBRRing: MatchRing = MOCKALLRINGS[3];
                const fifthBRRing: MatchRing = MOCKALLRINGS[4];
                const startEvent: MatchStateChangedEvent = {
                    startDate: startDate,
                    state: MatchState.Active,
                    matchId: "test",
                };

                // Act
                jasmine.clock().mockDate(startDate);
                const frame = scheduler.createTime("-|");
                cold("a-----", { a: startEvent }).subscribe(matchService.startedEvent$);
                cold("a-----", { a: startEvent }).subscribe(matchService.state$);
                cold("-12345", {
                    1: frame * firstBRRing.holdStartTime,
                    2: frame * (secondBRRing.holdStartTime - firstBRRing.holdStartTime),
                    3: frame * (thirdBRRing.holdStartTime - secondBRRing.holdStartTime),
                    4: frame * (fourthBRRing.holdStartTime - thirdBRRing.holdStartTime),
                    5: frame * (fifthBRRing.holdStartTime - fourthBRRing.holdStartTime),
                }).subscribe((tickDuration) => {
                    jasmine.clock().tick(tickDuration);
                });

                // Assert
                expectObservable(sut.currentBRRing$).toBe("u12345", {
                    u: undefined,
                    1: firstBRRing,
                    2: secondBRRing,
                    3: thirdBRRing,
                    4: fourthBRRing,
                    5: fifthBRRing,
                });
            });
        });

        it("ring 6", () => {
            scheduler.run(({ cold, expectObservable }) => {
                // Arrange
                configurationService.mockSetConfig(MOCKCONFIG);
                const startDate = new Date("2020-01-01T00:00:00");
                const firstBRRing: MatchRing = MOCKALLRINGS[0];
                const secondBRRing: MatchRing = MOCKALLRINGS[1];
                const thirdBRRing: MatchRing = MOCKALLRINGS[2];
                const fourthBRRing: MatchRing = MOCKALLRINGS[3];
                const fifthBRRing: MatchRing = MOCKALLRINGS[4];
                const sixthBRRing: MatchRing = MOCKALLRINGS[5];
                const startEvent: MatchStateChangedEvent = {
                    startDate: startDate,
                    state: MatchState.Active,
                    matchId: "test",
                };

                // Act
                jasmine.clock().mockDate(startDate);
                const frame = scheduler.createTime("-|");
                cold("a------", { a: startEvent }).subscribe(matchService.startedEvent$);
                cold("a------", { a: startEvent }).subscribe(matchService.state$);
                cold("-123456", {
                    1: frame * firstBRRing.holdStartTime,
                    2: frame * (secondBRRing.holdStartTime - firstBRRing.holdStartTime),
                    3: frame * (thirdBRRing.holdStartTime - secondBRRing.holdStartTime),
                    4: frame * (fourthBRRing.holdStartTime - thirdBRRing.holdStartTime),
                    5: frame * (fifthBRRing.holdStartTime - fourthBRRing.holdStartTime),
                    6: frame * (sixthBRRing.holdStartTime - fifthBRRing.holdStartTime),
                }).subscribe((tickDuration) => {
                    jasmine.clock().tick(tickDuration);
                });

                // Assert
                expectObservable(sut.currentBRRing$).toBe("u123456", {
                    u: undefined,
                    1: firstBRRing,
                    2: secondBRRing,
                    3: thirdBRRing,
                    4: fourthBRRing,
                    5: fifthBRRing,
                    6: sixthBRRing,
                });
            });
        });

        it("ring 6 & reset", () => {
            scheduler.run(({ cold, expectObservable }) => {
                // Arrange
                configurationService.mockSetConfig(MOCKCONFIG);
                const startDate = new Date("2020-01-01T00:00:00");
                const firstBRRing: MatchRing = MOCKALLRINGS[0];
                const secondBRRing: MatchRing = MOCKALLRINGS[1];
                const thirdBRRing: MatchRing = MOCKALLRINGS[2];
                const fourthBRRing: MatchRing = MOCKALLRINGS[3];
                const fifthBRRing: MatchRing = MOCKALLRINGS[4];
                const sixthBRRing: MatchRing = MOCKALLRINGS[5];
                const startEvent: MatchStateChangedEvent = {
                    startDate: startDate,
                    state: MatchState.Active,
                    matchId: "test",
                };
                const endEvent: MatchStateChangedEvent = {
                    startDate: startEvent.startDate,
                    endDate: addMilliseconds(startEvent.startDate!, sixthBRRing.shrinkEndTime),
                    state: MatchState.Inactive,
                    matchId: "test",
                };

                // Act
                jasmine.clock().mockDate(startDate);
                const frame = scheduler.createTime("-|");
                cold("a-------a", { a: startEvent }).subscribe(matchService.startedEvent$);
                cold("a-------a", { a: startEvent }).subscribe(matchService.state$);
                cold("-------a-", { a: endEvent }).subscribe(matchService.state$);
                cold("-------a-", { a: endEvent }).subscribe(matchService.endedEvent$);
                cold("-123456e-", {
                    1: frame * firstBRRing.holdStartTime,
                    2: frame * (secondBRRing.holdStartTime - firstBRRing.holdStartTime),
                    3: frame * (thirdBRRing.holdStartTime - secondBRRing.holdStartTime),
                    4: frame * (fourthBRRing.holdStartTime - thirdBRRing.holdStartTime),
                    5: frame * (fifthBRRing.holdStartTime - fourthBRRing.holdStartTime),
                    6: frame * (sixthBRRing.holdStartTime - fifthBRRing.holdStartTime),
                    e: frame * (sixthBRRing.holdStartTime - endEvent.endDate!.getTime()),
                }).subscribe((tickDuration) => {
                    jasmine.clock().tick(tickDuration);
                });

                // Assert
                expectObservable(sut.currentBRRing$).toBe("u123456-u", {
                    u: undefined,
                    1: firstBRRing,
                    2: secondBRRing,
                    3: thirdBRRing,
                    4: fourthBRRing,
                    5: fifthBRRing,
                    6: sixthBRRing,
                });
            });
        });
    }); // currentBRRing$
});
