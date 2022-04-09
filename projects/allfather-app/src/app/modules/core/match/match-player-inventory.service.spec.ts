import { InventorySlot, InventorySlots } from "@allfather-app/app/common/inventory-slots";
import { Item } from "@allfather-app/app/common/items/item";
import { WeaponItem } from "@allfather-app/app/common/items/weapon-item";
import { MatchState, MatchStateChangedEvent } from "@allfather-app/app/common/match/state";
import { OverwolfGameDataService, OWInfoUpdates2Event } from "@allfather-app/app/common/services/overwolf";
import { TestBed } from "@angular/core/testing";
import { TestScheduler } from "rxjs/testing";
import { MockMatchService } from "../mocks/services/mock-match.service";
import { MockOverwolfGameDataService } from "../mocks/services/mock-overwolf-game-data.service";
import { MatchPlayerInventoryService } from "./match-player-inventory.service";
import { MatchService } from "./match.service";

const ULTACCELID = "ultimate_accelerant";
const ULTACCELNUM = 162;
const PHOENIXKITID = "phoenix_kit";
const PHOENIXKITNUM = 163;
const MEDKITID = "med_kit";
const MEDKITNUM = 164;
const SYRINGID = "syringe";
const SYRINGNUM = 165;
const SHIELDBATTERYID = "shield_battery";
const SHIELDBATTERYNUM = 166;
const SHIELDCELLID = "shield_cell";
const SHIELDCELLNUM = 167;
const GRENADETHERMITEID = "grenade_thermite";
const GRENADETHERMITENUM = 190;
const GRENADEFRAGID = "grenade_frag";
const GRENADEFRAGNUM = 191;
const GRENADEARCSTARID = "grenade_arc_star";
const GRENADEARCSTARNUM = 192;

describe("MatchPlayerInventoryService", () => {
    let sut: MatchPlayerInventoryService;
    let scheduler: TestScheduler;
    let matchService: MatchService;
    let overwolfGameDataService: OverwolfGameDataService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                MatchPlayerInventoryService,
                { provide: MatchService, useClass: MockMatchService },
                { provide: OverwolfGameDataService, useClass: MockOverwolfGameDataService },
            ],
        });
        scheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
    });

    beforeEach(() => {
        jasmine.clock().uninstall();
        jasmine.clock().install();
        sut = TestBed.inject(MatchPlayerInventoryService);
        matchService = TestBed.inject(MatchService);
        overwolfGameDataService = TestBed.inject(OverwolfGameDataService);
    });

    it("resets on match start", () => {
        scheduler.run(({ cold, expectObservable }) => {
            // Arrange
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
            const expectedInUseItem = new Item({ fromId: "empty_handed" });
            const expectedWeaponSlots: InventorySlots<WeaponItem> = {
                0: {
                    item: new WeaponItem({ fromId: "empty_handed" }),
                },
            };
            const expectedInventorySlots: InventorySlots = {
                0: {
                    item: new Item({ fromId: "empty_handed" }),
                },
            };

            // Act
            cold("a--a", { a: startEvent }).subscribe(matchService.startedEvent$);
            cold("--a-", { a: endEvent }).subscribe(matchService.endedEvent$);
            cold("-a--", { a: expectedInUseItem }).subscribe(sut.myInUseItem$);
            cold("-a--", { a: expectedWeaponSlots }).subscribe(sut.myWeaponSlots$);
            cold("-a--", { a: expectedInventorySlots }).subscribe(sut.myInventorySlots$);

            // Assert
            expectObservable(sut.myInUseItem$).toBe("ui-u", { u: undefined, i: expectedInUseItem });
            expectObservable(sut.myWeaponSlots$).toBe("ew-e", { e: {}, w: expectedWeaponSlots });
            expectObservable(sut.myInventorySlots$).toBe("ei-e", { e: {}, i: expectedInventorySlots });
        });
    });

    it("correctly calculates basic inventory", () => {
        scheduler.run(({ cold, expectObservable }) => {
            // Arrange
            const startEvent: MatchStateChangedEvent = {
                startDate: new Date(),
                state: MatchState.Active,
                matchId: "test",
            };

            // Act
            cold("s---------", { s: startEvent }).subscribe(matchService.startedEvent$);
            cold("-abcdefghi", {
                a: createInventoryEventFn(0, `unknown_${ULTACCELNUM}`, 1),
                b: createInventoryEventFn(1, `unknown_${PHOENIXKITNUM}`, 1),
                c: createInventoryEventFn(2, `unknown_${MEDKITNUM}`, 2),
                d: createInventoryEventFn(3, `unknown_${SYRINGNUM}`, 4),
                e: createInventoryEventFn(4, `unknown_${SHIELDBATTERYNUM}`, 2),
                f: createInventoryEventFn(5, `unknown_${SHIELDCELLNUM}`, 4),
                g: createInventoryEventFn(6, `unknown_${GRENADETHERMITENUM}`, 1),
                h: createInventoryEventFn(7, `unknown_${GRENADEFRAGNUM}`, 1),
                i: createInventoryEventFn(8, `unknown_${GRENADEARCSTARNUM}`, 1),
            }).subscribe(overwolfGameDataService.infoUpdates$);

            // Assert
            expectObservable(sut.myInventorySlots$).toBe("0abcdefghi", {
                0: {},
                a: {
                    0: createInventorySlotFn(ULTACCELID, 1),
                } as InventorySlots<Item>,
                b: {
                    0: createInventorySlotFn(ULTACCELID, 1),
                    1: createInventorySlotFn(PHOENIXKITID, 1),
                } as InventorySlots<Item>,
                c: {
                    0: createInventorySlotFn(ULTACCELID, 1),
                    1: createInventorySlotFn(PHOENIXKITID, 1),
                    2: createInventorySlotFn(MEDKITID, 2),
                } as InventorySlots<Item>,
                d: {
                    0: createInventorySlotFn(ULTACCELID, 1),
                    1: createInventorySlotFn(PHOENIXKITID, 1),
                    2: createInventorySlotFn(MEDKITID, 2),
                    3: createInventorySlotFn(SYRINGID, 4),
                } as InventorySlots<Item>,
                e: {
                    0: createInventorySlotFn(ULTACCELID, 1),
                    1: createInventorySlotFn(PHOENIXKITID, 1),
                    2: createInventorySlotFn(MEDKITID, 2),
                    3: createInventorySlotFn(SYRINGID, 4),
                    4: createInventorySlotFn(SHIELDBATTERYID, 2),
                } as InventorySlots<Item>,
                f: {
                    0: createInventorySlotFn(ULTACCELID, 1),
                    1: createInventorySlotFn(PHOENIXKITID, 1),
                    2: createInventorySlotFn(MEDKITID, 2),
                    3: createInventorySlotFn(SYRINGID, 4),
                    4: createInventorySlotFn(SHIELDBATTERYID, 2),
                    5: createInventorySlotFn(SHIELDCELLID, 4),
                } as InventorySlots<Item>,
                g: {
                    0: createInventorySlotFn(ULTACCELID, 1),
                    1: createInventorySlotFn(PHOENIXKITID, 1),
                    2: createInventorySlotFn(MEDKITID, 2),
                    3: createInventorySlotFn(SYRINGID, 4),
                    4: createInventorySlotFn(SHIELDBATTERYID, 2),
                    5: createInventorySlotFn(SHIELDCELLID, 4),
                    6: createInventorySlotFn(GRENADETHERMITEID, 1),
                } as InventorySlots<Item>,
                h: {
                    0: createInventorySlotFn(ULTACCELID, 1),
                    1: createInventorySlotFn(PHOENIXKITID, 1),
                    2: createInventorySlotFn(MEDKITID, 2),
                    3: createInventorySlotFn(SYRINGID, 4),
                    4: createInventorySlotFn(SHIELDBATTERYID, 2),
                    5: createInventorySlotFn(SHIELDCELLID, 4),
                    6: createInventorySlotFn(GRENADETHERMITEID, 1),
                    7: createInventorySlotFn(GRENADEFRAGID, 1),
                } as InventorySlots<Item>,
                i: {
                    0: createInventorySlotFn(ULTACCELID, 1),
                    1: createInventorySlotFn(PHOENIXKITID, 1),
                    2: createInventorySlotFn(MEDKITID, 2),
                    3: createInventorySlotFn(SYRINGID, 4),
                    4: createInventorySlotFn(SHIELDBATTERYID, 2),
                    5: createInventorySlotFn(SHIELDCELLID, 4),
                    6: createInventorySlotFn(GRENADETHERMITEID, 1),
                    7: createInventorySlotFn(GRENADEFRAGID, 1),
                    8: createInventorySlotFn(GRENADEARCSTARID, 1),
                } as InventorySlots<Item>,
            });
        });
    });

    it("correctly accumulates + removes basic inventory", () => {
        scheduler.run(({ cold, expectObservable }) => {
            // Arrange
            const startEvent: MatchStateChangedEvent = {
                startDate: new Date(),
                state: MatchState.Active,
                matchId: "test",
            };

            // Act
            cold("s-------", { s: startEvent }).subscribe(matchService.startedEvent$);
            cold("-abc", {
                a: createInventoryEventFn(0, `unknown_${ULTACCELNUM}`, 1),
                b: createInventoryEventFn(1, `unknown_${PHOENIXKITNUM}`, 1),
                c: createEmptyInventoryEventFn(0),
                d: createInventoryEventFn(2, `unknown_${SYRINGNUM}`, 4),
                e: createEmptyInventoryEventFn(1),
            }).subscribe(overwolfGameDataService.infoUpdates$);

            // Assert
            expectObservable(sut.myInventorySlots$).toBe("0abc", {
                0: {},
                a: {
                    0: createInventorySlotFn(ULTACCELID, 1),
                } as InventorySlots<Item>,
                b: {
                    0: createInventorySlotFn(ULTACCELID, 1),
                    1: createInventorySlotFn(PHOENIXKITID, 1),
                } as InventorySlots<Item>,
                c: {
                    0: undefined,
                    1: createInventorySlotFn(PHOENIXKITID, 1),
                } as InventorySlots<Item>,
                d: {
                    0: undefined,
                    1: createInventorySlotFn(PHOENIXKITID, 1),
                    2: createInventorySlotFn(SYRINGID, 4),
                } as InventorySlots<Item>,
                e: {
                    0: undefined,
                    1: undefined,
                    2: createInventorySlotFn(SYRINGID, 4),
                } as InventorySlots<Item>,
            });
        });
    });

    /**
     * @overwolfQuirk - When all weapons are dropped, "Thermite Grenade" is returned as the weapon in use.
     */
    it("myWeapons$ correctly displays weapons", () => {
        scheduler.run(({ cold, expectObservable }) => {
            // Arrange
            const startEvent: MatchStateChangedEvent = {
                startDate: new Date(),
                state: MatchState.Active,
                matchId: "test",
            };

            // Act
            cold("a-------", { a: startEvent }).subscribe(matchService.state$);
            cold("a-------", { a: startEvent }).subscribe(matchService.startedEvent$);
            cold("-1abcdef1", {
                1: createWeaponsEventFn(), // No weapons
                a: createWeaponsEventFn("R-301 Carbine"),
                b: createWeaponsEventFn("R-301 Carbine", "VK-47 Flatline"),
                c: createWeaponsEventFn("Melee"),
                d: createWeaponsEventFn("Thermite Grenade"), // All weapons dropped
                e: createWeaponsEventFn("Frag Grenade"),
                f: createWeaponsEventFn("Arc Star"),
            }).subscribe(overwolfGameDataService.infoUpdates$);

            // Assert
            expectObservable(sut.myWeaponSlots$).toBe("01AB1---", {
                0: {},
                1: {
                    0: { item: new WeaponItem({ fromId: "empty_handed" }) },
                },
                A: {
                    0: { item: new WeaponItem({ fromId: "r301" }) },
                },
                B: {
                    0: { item: new WeaponItem({ fromId: "r301" }) },
                    1: { item: new WeaponItem({ fromId: "vk47_flatline" }) },
                },
            });
        });
    });
});

function createInventorySlotFn(id: string, amount: number): InventorySlot {
    return {
        item: new Item({ fromId: id }),
        amount: amount,
    };
}

function createInventoryEventFn(inventorySlotKey: number, name: string, amount: number): OWInfoUpdates2Event {
    const infoEvent: any = {
        feature: "inventory",
        info: {
            me: {},
        },
    };
    infoEvent.info.me[`inventory_${inventorySlotKey}`] = {
        name: name,
        amount: amount,
    };
    return infoEvent as OWInfoUpdates2Event;
}

function createEmptyInventoryEventFn(inventorySlotKey: number): OWInfoUpdates2Event {
    const infoEvent: any = {
        feature: "inventory",
        info: {
            me: {},
        },
    };
    infoEvent.info.me[`inventory_${inventorySlotKey}`] = null;
    return infoEvent as OWInfoUpdates2Event;
}

function createWeaponsEventFn(weapon0?: string, weapon1?: string): OWInfoUpdates2Event {
    const infoEvent: any = {
        feature: "inventory",
        info: {
            me: {
                weapons: {},
            },
        },
    };
    if (weapon0) infoEvent.info.me.weapons.weapon0 = weapon0;
    if (weapon1) infoEvent.info.me.weapons.weapon1 = weapon1;
    return infoEvent as OWInfoUpdates2Event;
}
