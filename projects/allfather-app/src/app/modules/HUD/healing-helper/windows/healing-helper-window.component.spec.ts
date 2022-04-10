import { InventorySlot, InventorySlots } from "@allfather-app/app/common/inventory-slots";
import { Item } from "@allfather-app/app/common/items/item";
import { MatchLocationPhase } from "@allfather-app/app/common/match/location";
import { MatchRing } from "@allfather-app/app/common/match/ring";
import { MatchState, MatchStateChangedEvent } from "@allfather-app/app/common/match/state";
import { PlayerState } from "@allfather-app/app/common/player-state";
import { supressConsoleLog } from "@allfather-app/app/common/testing-helpers";
import { ConfigurationService } from "@allfather-app/app/modules/core/configuration.service";
import { MatchPlayerInventoryService } from "@allfather-app/app/modules/core/match/match-player-inventory.service";
import { MatchPlayerLocationService } from "@allfather-app/app/modules/core/match/match-player-location.service";
import { MatchPlayerStatsService } from "@allfather-app/app/modules/core/match/match-player-stats.service";
import { MatchPlayerService } from "@allfather-app/app/modules/core/match/match-player.service";
import { MatchRingService } from "@allfather-app/app/modules/core/match/match-ring.service";
import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { MockUIContainerComponent } from "@allfather-app/app/modules/core/mocks/components/mock-ui-container.component";
import { MockConfigurationService } from "@allfather-app/app/modules/core/mocks/services/mock-configuration.service";
import { MockMatchPlayerInventoryService } from "@allfather-app/app/modules/core/mocks/services/mock-match-player-inventory.service";
import { MockMatchPlayerLocationService } from "@allfather-app/app/modules/core/mocks/services/mock-match-player-location.service";
import { MockMatchPlayerStatsService } from "@allfather-app/app/modules/core/mocks/services/mock-match-player-stats.service";
import { MockMatchPlayerService } from "@allfather-app/app/modules/core/mocks/services/mock-match-player.service";
import { MockMatchRingService } from "@allfather-app/app/modules/core/mocks/services/mock-match-ring.service";
import { MockMatchService } from "@allfather-app/app/modules/core/mocks/services/mock-match.service";
import { Configuration } from "@allfather-app/configs/config.interface";
import { ChangeDetectorRef } from "@angular/core";
import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { HealingHelperWindowComponent } from "./healing-helper-window.component";

type HealingItemHealthTime = {
    id: string;
    neededHealthTime: number; // (damagePerTick / ringTickRate) * duration
};
type HealingItem = { id: string; duration: number };

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

const MOCKINVENTORYSLOTS: InventorySlots = {
    0: {
        item: new Item({ fromId: "syringe" }),
        amount: 4,
    },
    1: {
        item: new Item({ fromId: "shield_cell" }),
        amount: 4,
    },
    2: {
        item: new Item({ fromId: "med_kit" }),
        amount: 2,
    },
    3: {
        item: new Item({ fromId: "shield_battery" }),
        amount: 2,
    },
    4: {
        item: new Item({ fromId: "phoenix_kit" }),
        amount: 1,
    },
};

const MOCKCONFIG = {
    facts: {
        maxHealth: 100,
    },
    brFacts: {
        ringDamageTickRate: 1500,
        rings: MOCKALLRINGS,
    },
} as Configuration;

describe("HealingHelperWindowComponent", () => {
    let sut: HealingHelperWindowComponent;
    let fixture: ComponentFixture<HealingHelperWindowComponent>;
    let configurationService: MockConfigurationService;
    let matchPlayerInventoryService: MatchPlayerInventoryService;
    let matchPlayerLocationService: MatchPlayerLocationService;
    let matchPlayerService: MatchPlayerService;
    let matchPlayerStatsService: MatchPlayerStatsService;
    let matchRingService: MatchRingService;
    let matchService: MatchService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HealingHelperWindowComponent, MockUIContainerComponent],
            providers: [
                { provide: ChangeDetectorRef, useValue: {} },
                { provide: ConfigurationService, useClass: MockConfigurationService },
                { provide: MatchPlayerInventoryService, useClass: MockMatchPlayerInventoryService },
                { provide: MatchPlayerLocationService, useClass: MockMatchPlayerLocationService },
                { provide: MatchPlayerService, useClass: MockMatchPlayerService },
                { provide: MatchPlayerStatsService, useClass: MockMatchPlayerStatsService },
                { provide: MatchRingService, useClass: MockMatchRingService },
                { provide: MatchService, useClass: MockMatchService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        supressConsoleLog();
        fixture = TestBed.createComponent(HealingHelperWindowComponent);
        sut = fixture.componentInstance;
        configurationService = TestBed.inject(ConfigurationService) as unknown as MockConfigurationService;
        matchPlayerInventoryService = TestBed.inject(MatchPlayerInventoryService);
        matchPlayerLocationService = TestBed.inject(MatchPlayerLocationService);
        matchPlayerService = TestBed.inject(MatchPlayerService);
        matchPlayerStatsService = TestBed.inject(MatchPlayerStatsService);
        matchRingService = TestBed.inject(MatchRingService);
        matchService = TestBed.inject(MatchService);
        fixture.detectChanges(); // ngOnInit
    });

    afterEach(() => {
        fixture.destroy();
    });

    it("should be created", () => {
        expect(sut).toBeDefined();
    });

    it("should not show by default", () => {
        const actual = sut.isVisible;
        expect(actual).toBeFalse();
    });

    describe("isVisible", () => {
        it("shows on match start and landed", () => {
            // Arrange
            jasmine.clock().mockDate(new Date(0));
            const startEvent: MatchStateChangedEvent = {
                startDate: new Date(),
                state: MatchState.Active,
                matchId: "test",
            };

            // Act
            matchService.startedEvent$.next(startEvent);
            matchService.state$.next(startEvent);
            matchPlayerService.myState$.next(PlayerState.Alive);
            let actual = sut.isVisible;
            expect(actual).toBeFalse();

            matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);
            actual = sut.isVisible;

            // Assert
            expect(actual).toBeTrue();
        });

        it("hides after a player is knocked", fakeAsync(() => {
            // Arrange
            jasmine.clock().mockDate(new Date(0));
            const startEvent: MatchStateChangedEvent = {
                startDate: new Date(),
                state: MatchState.Active,
                matchId: "test",
            };
            matchService.startedEvent$.next(startEvent);
            matchService.state$.next(startEvent);
            matchPlayerService.myState$.next(PlayerState.Alive);
            matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);
            tick(60 * 1000);

            // Act
            matchPlayerService.myState$.next(PlayerState.Knocked);
            tick(60 * 1000);

            // Assert
            const actual = sut.isVisible;
            expect(actual).toBeFalse();
        }));

        it("hides when player is eliminated", fakeAsync(() => {
            // Arrange
            jasmine.clock().mockDate(new Date(0));
            const startEvent: MatchStateChangedEvent = {
                startDate: new Date(),
                state: MatchState.Active,
                matchId: "test",
            };
            matchService.startedEvent$.next(startEvent);
            matchService.state$.next(startEvent);
            matchPlayerService.myState$.next(PlayerState.Alive);
            matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);
            tick(60 * 1000);

            // Act
            matchPlayerService.myState$.next(PlayerState.Eliminated);
            tick(60 * 1000);

            // Assert
            const actual = sut.isVisible;
            expect(actual).toBeFalse();
        }));

        it("hides when player is disconnected", fakeAsync(() => {
            // Arrange
            jasmine.clock().mockDate(new Date(0));
            const startEvent: MatchStateChangedEvent = {
                startDate: new Date(),
                state: MatchState.Active,
                matchId: "test",
            };
            matchService.startedEvent$.next(startEvent);
            matchService.state$.next(startEvent);
            matchPlayerService.myState$.next(PlayerState.Alive);
            matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);
            tick(60 * 1000);

            // Act
            matchPlayerService.myState$.next(PlayerState.Disconnected);
            tick(60 * 1000);

            // Assert
            const actual = sut.isVisible;
            expect(actual).toBeFalse();
        }));

        it("hides on victory", fakeAsync(() => {
            // Arrange
            jasmine.clock().mockDate(new Date(0));
            const startEvent: MatchStateChangedEvent = {
                startDate: new Date(),
                state: MatchState.Active,
                matchId: "test",
            };
            matchService.startedEvent$.next(startEvent);
            matchService.state$.next(startEvent);
            matchPlayerService.myState$.next(PlayerState.Alive);
            matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);
            tick(60 * 1000);

            // Act
            matchPlayerStatsService.victory$.next(true);
            tick(60 * 1000);

            // Assert
            const actual = sut.isVisible;
            expect(actual).toBeFalse();
            discardPeriodicTasks();
        }));

        it("hides on match end", fakeAsync(() => {
            // Arrange
            jasmine.clock().mockDate(new Date(0));
            const startEvent: MatchStateChangedEvent = {
                startDate: new Date(),
                state: MatchState.Active,
                matchId: "test",
            };
            const endEvent: MatchStateChangedEvent = {
                startDate: startEvent.startDate,
                endDate: new Date(),
                state: MatchState.Inactive,
                matchId: "test",
            };
            matchService.startedEvent$.next(startEvent);
            matchService.state$.next(startEvent);
            matchPlayerService.myState$.next(PlayerState.Alive);
            matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);
            tick(60 * 1000);

            // Act
            matchService.endedEvent$.next(endEvent);
            matchService.state$.next(endEvent);
            tick(60 * 1000);

            // Assert
            const actual = sut.isVisible;
            expect(actual).toBeFalse();
            discardPeriodicTasks();
        }));
    });

    describe("availableHealingItems", () => {
        it("returns healing items for ring 1", fakeAsync(() => {
            // Arrange
            const firstRing = MOCKALLRINGS.find((ring) => ring.ringNumber === 1);
            configurationService.mockSetConfig(MOCKCONFIG);
            matchRingService.allBRRings$.next(MOCKALLRINGS);
            matchRingService.currentBRRing$.next(firstRing);
            matchPlayerInventoryService.myInventorySlots$.next(MOCKINVENTORYSLOTS);

            const expected: HealingItemHealthTime[] = [
                {
                    id: "syringe",
                    neededHealthTime: 6.667999999999999,
                },
                {
                    id: "med_kit",
                    neededHealthTime: 10.668,
                },
                {
                    id: "phoenix_kit",
                    neededHealthTime: 13.334666666666665,
                },
            ];

            // Act
            const actual = sut.availableHealingItems;

            // Assert
            expect(actual).toEqual(expected);
        }));

        it("returns some healing items for ring 1", fakeAsync(() => {
            // Arrange
            const firstRing = MOCKALLRINGS.find((ring) => ring.ringNumber === 1);
            configurationService.mockSetConfig(MOCKCONFIG);
            matchRingService.allBRRings$.next(MOCKALLRINGS);
            matchRingService.currentBRRing$.next(firstRing);
            const inventorySlots = {
                0: MOCKINVENTORYSLOTS[0],
            };
            matchPlayerInventoryService.myInventorySlots$.next(inventorySlots);

            const expected: HealingItemHealthTime[] = [
                {
                    id: "syringe",
                    neededHealthTime: 6.667999999999999,
                },
            ];

            // Act
            const actual = sut.availableHealingItems;

            // Assert
            expect(actual).toEqual(expected);
        }));

        it("returns healing items for ring 6", fakeAsync(() => {
            // Arrange
            const firstRing = MOCKALLRINGS.find((ring) => ring.ringNumber === 6);
            configurationService.mockSetConfig(MOCKCONFIG);
            matchRingService.allBRRings$.next(MOCKALLRINGS);
            matchRingService.currentBRRing$.next(firstRing);
            const inventorySlots = {
                0: MOCKINVENTORYSLOTS[0],
            };
            matchPlayerInventoryService.myInventorySlots$.next(inventorySlots);

            const expected: HealingItemHealthTime[] = [
                {
                    id: "syringe",
                    neededHealthTime: 83.35,
                },
            ];

            // Act
            const actual = sut.availableHealingItems;

            // Assert
            expect(actual).toEqual(expected);
        }));
    });

    describe("bugfixes", () => {
        it("does not error when inventory slot is null", fakeAsync(() => {
            // Arrange
            const firstRing = MOCKALLRINGS.find((ring) => ring.ringNumber === 6);
            configurationService.mockSetConfig(MOCKCONFIG);
            matchRingService.allBRRings$.next(MOCKALLRINGS);
            matchRingService.currentBRRing$.next(firstRing);
            matchPlayerInventoryService.myInventorySlots$.next({
                0: undefined as unknown as InventorySlot,
            });

            const expected: HealingItemHealthTime[] = [];

            // Act
            const actual = sut.availableHealingItems;

            // Assert
            expect(actual).toEqual(expected);
        }));
    });
});
