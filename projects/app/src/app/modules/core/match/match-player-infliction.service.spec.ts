import { TestBed } from "@angular/core/testing";
import { TestScheduler } from "rxjs/testing";
import { InventorySlots } from "../../../common/inventory-slots";
import { WeaponItem } from "../../../common/items/weapon-item";
import { MatchInflictionEvent } from "../../../common/match/infliction-event";
import { MatchRoster } from "../../../common/match/roster";
import { MatchRosterPlayer } from "../../../common/match/roster-player";
import { PlayerState } from "../../../common/player-state";
import { supressConsoleLog } from "../../../common/testing-helpers";
import { ConfigurationService } from "../configuration.service";
import { MockConfigurationService } from "../mocks/services/mock-configuration.service";
import { MockMatchKillfeedService } from "../mocks/services/mock-match-killfeed.service";
import { MockMatchPlayerInventoryService } from "../mocks/services/mock-match-player-inventory.service";
import { MockMatchPlayerService } from "../mocks/services/mock-match-player.service";
import { MockMatchRosterService } from "../mocks/services/mock-match-roster.service";
import { MockMatchService } from "../mocks/services/mock-match.service";
import { MockOverwolfGameDataService } from "../mocks/services/mock-overwolf-game-data.service";
import { MockPlayerService } from "../mocks/services/mock-player.service";
import { OverwolfGameDataService } from "../overwolf";
import { PlayerService } from "../player.service";
import { MatchKillfeedService } from "./match-killfeed.service";
import { MatchPlayerInflictionService } from "./match-player-infliction.service";
import { MatchPlayerInventoryService } from "./match-player-inventory.service";
import { MatchPlayerService } from "./match-player.service";
import { MatchRosterService } from "./match-roster.service";
import { MatchService } from "./match.service";

describe("MatchPlayerInflictionService", () => {
    let sut: MatchPlayerInflictionService;
    let scheduler: TestScheduler;
    let configurationService: MockConfigurationService;
    let matchKillfeedService: MatchKillfeedService;
    let matchPlayerInventoryService: MatchPlayerInventoryService;
    let matchPlayerService: MatchPlayerService;
    let matchRosterService: MatchRosterService;
    let matchService: MatchService;
    let overwolfGameDataService: OverwolfGameDataService;
    let playerService: PlayerService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                MatchPlayerInflictionService,
                { provide: ConfigurationService, useClass: MockConfigurationService },
                { provide: MatchKillfeedService, useClass: MockMatchKillfeedService },
                { provide: MatchPlayerInventoryService, useClass: MockMatchPlayerInventoryService },
                { provide: MatchPlayerService, useClass: MockMatchPlayerService },
                { provide: MatchRosterService, useClass: MockMatchRosterService },
                { provide: MatchService, useClass: MockMatchService },
                { provide: OverwolfGameDataService, useClass: MockOverwolfGameDataService },
                { provide: PlayerService, useClass: MockPlayerService },
            ],
        });
    });

    beforeEach(() => {
        supressConsoleLog();
        jasmine.clock().uninstall();
        jasmine.clock().install();
        scheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
        sut = TestBed.inject(MatchPlayerInflictionService);
        configurationService = TestBed.inject(ConfigurationService) as unknown as MockConfigurationService;
        matchKillfeedService = TestBed.inject(MatchKillfeedService);
        matchPlayerInventoryService = TestBed.inject(MatchPlayerInventoryService);
        matchPlayerService = TestBed.inject(MatchPlayerService);
        matchRosterService = TestBed.inject(MatchRosterService);
        matchService = TestBed.inject(MatchService);
        overwolfGameDataService = TestBed.inject(OverwolfGameDataService);
        playerService = TestBed.inject(PlayerService);
    });

    describe("myKillfeedEvent$ and notMyKillfeedEvent$", () => {
        it("partitions and emits the killfeed", () => {
            scheduler.run(({ cold, expectObservable }) => {
                // Arrange
                const rosterMe: MatchRosterPlayer = {
                    name: "Me",
                    isMe: true,
                    teamId: 1,
                };
                const rosterMyEnemy: MatchRosterPlayer = {
                    name: "MyVictim",
                    isMe: false,
                    teamId: 2,
                };
                const rosterPlayer1: MatchRosterPlayer = {
                    name: "Player1",
                    isMe: false,
                    teamId: 3,
                };
                const rosterPlayer2: MatchRosterPlayer = {
                    name: "Player2",
                    isMe: false,
                    teamId: 4,
                };

                const killfeedEvents: MatchInflictionEvent[] = [
                    {
                        timestamp: new Date(),
                        victim: rosterMyEnemy,
                        attacker: rosterMe,
                        isKnockdown: true,
                        isElimination: false,
                        weapon: new WeaponItem({ fromId: "r301" }),
                    },
                    {
                        timestamp: new Date(),
                        victim: rosterPlayer1,
                        attacker: rosterPlayer2,
                        isKnockdown: false,
                        isElimination: true,
                        weapon: new WeaponItem({ fromId: "r99" }),
                    },
                    {
                        timestamp: new Date(),
                        victim: rosterMyEnemy,
                        attacker: rosterMe,
                        isKnockdown: false,
                        isElimination: true,
                        weapon: new WeaponItem({ fromId: "r301" }),
                    },
                    {
                        timestamp: new Date(),
                        victim: rosterPlayer2,
                        attacker: rosterPlayer1,
                        isKnockdown: false,
                        isElimination: true,
                        weapon: new WeaponItem({ fromId: "flatline" }),
                    },
                ];

                // Act
                cold("-abcd", {
                    a: killfeedEvents[0],
                    b: killfeedEvents[1],
                    c: killfeedEvents[2],
                    d: killfeedEvents[3],
                }).subscribe(matchKillfeedService.killfeedEvent$);

                // Assert
                expectObservable(sut.myKillfeedEvent$).toBe("-a-c-", {
                    a: killfeedEvents[0],
                    c: killfeedEvents[2],
                });
                expectObservable(sut.notMyKillfeedEvent$).toBe("--b-d", {
                    b: killfeedEvents[1],
                    d: killfeedEvents[3],
                });
            });
        });
    }); // myKillfeedEvent$ and notMyKillfeedEvent$

    describe("myDamageEvent$", () => {
        it("correctly emits damage events", () => {
            scheduler.run(({ cold, expectObservable }) => {
                // Arrange
                const fakeNow = new Date("2020-01-01T00:00:00.000Z");
                const myName = "Me";
                const rosterMe: MatchRosterPlayer = {
                    name: myName,
                    isMe: true,
                    teamId: 1,
                };
                const rosterMyEnemy: MatchRosterPlayer = {
                    name: "MyVictim",
                    isMe: false,
                    teamId: 2,
                };
                const roster = new MatchRoster();
                roster.addPlayer(rosterMe);
                roster.addPlayer(rosterMyEnemy);
                const weapon = new WeaponItem({ fromId: "r301" });
                const weaponSlots: InventorySlots<WeaponItem> = {
                    0: {
                        item: weapon,
                    },
                };
                const rawDamageEvents: overwolf.gep.ApexLegends.GameEvent[] = [
                    {
                        name: "damage",
                        data: {
                            targetName: rosterMyEnemy.name,
                            damageAmount: 25,
                            armor: true,
                            headshot: true,
                        },
                    },
                    {
                        name: "damage",
                        data: {
                            targetName: rosterMyEnemy.name,
                            damageAmount: 10,
                            armor: false,
                            headshot: false,
                        },
                    },
                    {
                        name: "damage",
                        data: {
                            targetName: rosterMyEnemy.name,
                            damageAmount: 5,
                            armor: false,
                            headshot: false,
                        },
                    },
                ];
                const expectedInflictionEvents: MatchInflictionEvent[] = [
                    {
                        timestamp: fakeNow,
                        victim: rosterMyEnemy,
                        attacker: rosterMe,
                        hasShield: true,
                        isHeadshot: true,
                        shieldDamage: 25,
                        healthDamage: 0,
                        weapon: weapon,
                    },
                    {
                        timestamp: fakeNow,
                        victim: rosterMyEnemy,
                        attacker: rosterMe,
                        hasShield: false,
                        isHeadshot: false,
                        shieldDamage: 0,
                        healthDamage: 10,
                        weapon: weapon,
                    },
                    {
                        timestamp: fakeNow,
                        victim: rosterMyEnemy,
                        attacker: rosterMe,
                        hasShield: false,
                        isHeadshot: false,
                        shieldDamage: 0,
                        healthDamage: 5,
                        weapon: weapon,
                    },
                ];

                // Act
                jasmine.clock().mockDate(fakeNow);
                cold("a----", { a: myName }).subscribe(playerService.myName$);
                cold("a----", { a: PlayerState.Alive }).subscribe(matchPlayerService.myState$);
                cold("a----", { a: roster }).subscribe(matchRosterService.matchRoster$);
                cold("a----", { a: weaponSlots }).subscribe(matchPlayerInventoryService.myWeaponSlots$);
                cold("-abc-", {
                    a: rawDamageEvents[0],
                    b: rawDamageEvents[1],
                    c: rawDamageEvents[2],
                }).subscribe(overwolfGameDataService.newGameEvent$);

                // Assert
                expectObservable(sut.myDamageEvent$).toBe("-abc-", {
                    a: expectedInflictionEvents[0],
                    b: expectedInflictionEvents[1],
                    c: expectedInflictionEvents[2],
                });
            });
        });
    }); // myDamageEvent$

    describe("myKnockdownEvent$ and myEliminationEvent$", () => {
        it("correctly emits knockdowns and eliminations", () => {
            scheduler.run(({ cold, expectObservable }) => {
                // Arrange
                const fakeNow = new Date("2020-01-01T00:00:00.000Z");
                const myName = "Me";
                const rosterMe: MatchRosterPlayer = {
                    name: myName,
                    isMe: true,
                    teamId: 1,
                };
                const rosterMyEnemy: MatchRosterPlayer = {
                    name: "MyVictim",
                    isMe: false,
                    teamId: 2,
                };
                const roster = new MatchRoster();
                roster.addPlayer(rosterMe);
                roster.addPlayer(rosterMyEnemy);
                const weapon = new WeaponItem({});
                // Currently not in use:
                // const weaponSlots: InventorySlots<WeaponItem> = {
                //     0: {
                //         item: weapon,
                //     },
                // };
                const rawKnockdownEvent: overwolf.gep.ApexLegends.GameEvent = {
                    name: "knockdown",
                    data: {
                        victimName: rosterMyEnemy.name,
                    },
                };
                const rawEliminationEvent: overwolf.gep.ApexLegends.GameEvent = {
                    name: "kill",
                    data: {
                        victimName: rosterMyEnemy.name,
                    },
                };
                const expectedKnockdownEvent: MatchInflictionEvent = {
                    timestamp: fakeNow,
                    victim: rosterMyEnemy,
                    attacker: rosterMe,
                    isKnockdown: true,
                    isElimination: false,
                    weapon: weapon,
                };
                const expectedEliminationEvent: MatchInflictionEvent = {
                    timestamp: fakeNow,
                    victim: rosterMyEnemy,
                    attacker: rosterMe,
                    isKnockdown: false,
                    isElimination: true,
                    weapon: weapon,
                };

                // Act
                jasmine.clock().mockDate(fakeNow);
                cold("a--", { a: myName }).subscribe(playerService.myName$);
                cold("a--", { a: roster }).subscribe(matchRosterService.matchRoster$);
                cold("a--", { a: PlayerState.Alive }).subscribe(matchPlayerService.myState$);
                // cold("a--", { a: weaponSlots }).subscribe(matchPlayerInventoryService.myWeaponSlots$);
                cold("-a-b", {
                    a: rawKnockdownEvent,
                    b: rawEliminationEvent,
                }).subscribe(overwolfGameDataService.newGameEvent$);

                // Assert
                expectObservable(sut.myKnockdownEvent$).toBe("-a---", {
                    a: expectedKnockdownEvent,
                });
                expectObservable(sut.myEliminationEvent$).toBe("---b", {
                    b: expectedEliminationEvent,
                });
            });
        });
    }); // myDamageEvent$
});
