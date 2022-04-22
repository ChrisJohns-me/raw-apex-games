import { InventorySlots } from "@allfather-app/app/common/inventory-slots";
import { WeaponItem } from "@allfather-app/app/common/items/weapon-item";
import { MatchInflictionEvent, MatchInflictionEventAccum } from "@allfather-app/app/common/match/infliction-event";
import { MatchLocationPhase } from "@allfather-app/app/common/match/location";
import { MatchRoster } from "@allfather-app/app/common/match/roster";
import { MatchRosterPlayer } from "@allfather-app/app/common/match/roster-player";
import { MatchState, MatchStateChangedEvent } from "@allfather-app/app/common/match/state";
import { PlayerState } from "@allfather-app/app/common/player-state";
import { createInfliction } from "@allfather-app/app/common/utilities/infliction-aggregator.spec";
import { ConfigurationService } from "@allfather-app/app/modules/core/configuration.service";
import { GoogleAnalyticsService } from "@allfather-app/app/modules/core/google-analytics.service";
import { MatchKillfeedService } from "@allfather-app/app/modules/core/match/match-killfeed.service";
import { MatchPlayerInflictionService } from "@allfather-app/app/modules/core/match/match-player-infliction.service";
import { MatchPlayerLocationService } from "@allfather-app/app/modules/core/match/match-player-location.service";
import { MatchPlayerService } from "@allfather-app/app/modules/core/match/match-player.service";
import { MatchRosterService } from "@allfather-app/app/modules/core/match/match-roster.service";
import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { MockOpponentBannerComponent } from "@allfather-app/app/modules/core/mocks/components/mock-opponent-banner.component";
import { MockUIContainerComponent } from "@allfather-app/app/modules/core/mocks/components/mock-ui-container.component";
import { MockConfigurationService } from "@allfather-app/app/modules/core/mocks/services/mock-configuration.service";
import { MockGoogleAnalyticsService } from "@allfather-app/app/modules/core/mocks/services/mock-google-analytics.service";
import { MockMatchKillfeedService } from "@allfather-app/app/modules/core/mocks/services/mock-match-killfeed.service";
import { MockMatchPlayerInflictionService } from "@allfather-app/app/modules/core/mocks/services/mock-match-player-infliction.service";
import { MockMatchPlayerLocationService } from "@allfather-app/app/modules/core/mocks/services/mock-match-player-location.service";
import { MockMatchPlayerService } from "@allfather-app/app/modules/core/mocks/services/mock-match-player.service";
import { MockMatchRosterService } from "@allfather-app/app/modules/core/mocks/services/mock-match-roster.service";
import { MockMatchService } from "@allfather-app/app/modules/core/mocks/services/mock-match.service";
import { Configuration } from "@allfather-app/configs/config.interface";
import { ChangeDetectorRef } from "@angular/core";
import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { TestScheduler } from "rxjs/testing";
import { OpponentBanner } from "../components/opponent-banner/opponent-banner.component";
import { InflictionInsightWindowComponent } from "./infliction-insight-window.component";

describe("InflictionInsightWindowComponent", () => {
    let sut: InflictionInsightWindowComponent;
    let fixture: ComponentFixture<InflictionInsightWindowComponent>;
    let scheduler: TestScheduler;
    let config: MockConfigurationService;
    let matchPlayerInflictionService: MockMatchPlayerInflictionService;
    let matchPlayerLocationService: MatchPlayerLocationService;
    let matchPlayerService: MatchPlayerService;
    let matchRosterService: MatchRosterService;
    let matchService: MatchService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InflictionInsightWindowComponent, MockOpponentBannerComponent, MockUIContainerComponent],
            providers: [
                { provide: ChangeDetectorRef, useValue: {} },
                { provide: ConfigurationService, useClass: MockConfigurationService },
                { provide: GoogleAnalyticsService, useClass: MockGoogleAnalyticsService },
                { provide: MatchKillfeedService, useClass: MockMatchKillfeedService },
                { provide: MatchPlayerInflictionService, useClass: MockMatchPlayerInflictionService },
                { provide: MatchPlayerLocationService, useClass: MockMatchPlayerLocationService },
                { provide: MatchPlayerService, useClass: MockMatchPlayerService },
                { provide: MatchRosterService, useClass: MockMatchRosterService },
                { provide: MatchService, useClass: MockMatchService },
                { provide: MatchService, useClass: MockMatchService },
                // { provide: PlayerService, useClass: MockPlayerService },
            ],
        }).compileComponents();
    });

    beforeEach(async () => {
        // supressConsoleLog(); // TODO UNDO
        jasmine.clock().uninstall();
        jasmine.clock().install();
        scheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
        fixture = TestBed.createComponent(InflictionInsightWindowComponent);
        sut = fixture.componentInstance;
        config = TestBed.inject(ConfigurationService) as unknown as MockConfigurationService;
        matchPlayerInflictionService = TestBed.inject(MatchPlayerInflictionService) as unknown as MockMatchPlayerInflictionService;
        matchPlayerLocationService = TestBed.inject(MatchPlayerLocationService);
        matchPlayerService = TestBed.inject(MatchPlayerService);
        matchService = TestBed.inject(MatchService);
        matchRosterService = TestBed.inject(MatchRosterService);
        fixture.detectChanges(); // ngOnInit
    });

    afterEach(() => {
        fixture.destroy();
    });

    it("should be created", () => {
        expect(sut).toBeDefined();
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
            const mockConfig = {
                featureFlags: {
                    inflictionInsight: {
                        assumeKnockdownExpires: true,
                    },
                },
            };
            config.mockSetConfig(mockConfig as Configuration);

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

        it("continues to show after a player is knocked", fakeAsync(() => {
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
            expect(actual).toBeTrue();
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

        it("shows an opponent after a damage event", () => {
            scheduler.run(({ hot, expectObservable }) => {
                // Arrange
                jasmine.clock().mockDate(new Date(0));
                const startEvent: MatchStateChangedEvent = {
                    startDate: new Date(),
                    state: MatchState.Active,
                    matchId: "test",
                };
                const mockConfig = {
                    assumptions: {
                        opponentShieldDefault: 76,
                        opponentHealthDefault: 101,
                    },
                    facts: {
                        maxShield: 130,
                        maxHealth: 101,
                    },
                };
                config.mockSetConfig(mockConfig as Configuration);

                matchService.startedEvent$.next(startEvent);
                matchService.state$.next(startEvent);
                matchPlayerService.myState$.next(PlayerState.Alive);
                matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

                // Act
                const damageEvent: MatchInflictionEvent = {
                    timestamp: new Date(),
                    victim: { name: "Victim1", isMe: false },
                    attacker: { name: "Me", isMe: true },
                    hasShield: true,
                    isHeadshot: false,
                    shieldDamage: 27,
                    healthDamage: 0,
                    isKnockdown: false,
                    isElimination: false,
                    weapon: new WeaponItem({}),
                };
                hot("a|", { a: damageEvent }).subscribe(matchPlayerInflictionService.myDamageEvent$);

                const expectedInflictionAccum: MatchInflictionEventAccum = {
                    victim: { name: "Victim1", isMe: false },
                    shieldDamageSum: 27,
                    healthDamageSum: 0,
                    hasShield: true,
                    isKnocked: false,
                    isEliminated: false,
                    latestAttacker: { name: "Me", isMe: true },
                    latestTimestamp: new Date(),
                };
                const expectedValue: OpponentBanner[] = [
                    {
                        isIndirectBanner: false,
                        rosterPlayer: expectedInflictionAccum.victim!,
                        latestInflictionAccum: expectedInflictionAccum,
                        maybeMaxShield: 76,
                        maybeShieldAmount: 49,
                        maybeHealthAmount: 101,
                    },
                ];

                // Assert
                const actual = of(sut.opponentBannerList);
                expectObservable(actual).toBe("(a|)", { a: expectedValue });
            });
        });

        it("shows an opponent after a knockdown event", () => {
            scheduler.run(({ hot, expectObservable }) => {
                // Arrange
                jasmine.clock().mockDate(new Date(0));
                const startEvent: MatchStateChangedEvent = {
                    startDate: new Date(),
                    state: MatchState.Active,
                    matchId: "test",
                };
                const mockConfig = {
                    assumptions: {
                        opponentShieldDefault: 26,
                        opponentHealthDefault: 92,
                    },
                    facts: {
                        maxShield: 151,
                        maxHealth: 142,
                    },
                };
                config.mockSetConfig(mockConfig as Configuration);

                matchService.startedEvent$.next(startEvent);
                matchService.state$.next(startEvent);
                matchPlayerService.myState$.next(PlayerState.Alive);
                matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

                // Act
                const damageEvent: MatchInflictionEvent = {
                    timestamp: new Date(),
                    victim: { name: "Victim1", isMe: false },
                    attacker: { name: "Me", isMe: true },
                    hasShield: false,
                    isHeadshot: false,
                    shieldDamage: 0,
                    healthDamage: 92,
                    isKnockdown: true,
                    isElimination: false,
                    weapon: new WeaponItem({}),
                };
                hot("a", { a: damageEvent }).subscribe(matchPlayerInflictionService.myDamageEvent$);

                const expectedInflictionAccum: MatchInflictionEventAccum = {
                    victim: { name: "Victim1", isMe: false },
                    shieldDamageSum: 0,
                    healthDamageSum: 92,
                    hasShield: false,
                    isKnocked: true,
                    isEliminated: false,
                    latestAttacker: { name: "Me", isMe: true },
                    latestTimestamp: new Date(),
                };
                const expectedValue: OpponentBanner[] = [
                    {
                        isIndirectBanner: false,
                        rosterPlayer: expectedInflictionAccum.victim!,
                        latestInflictionAccum: expectedInflictionAccum,
                        maybeMaxShield: 0,
                        maybeShieldAmount: 26,
                        maybeHealthAmount: 0,
                    },
                ];

                // Assert
                const actual = of(sut.opponentBannerList);
                expectObservable(actual).toBe("(a|)", { a: expectedValue });
            });
        });

        it("shows an opponent after an elimination event", () => {
            scheduler.run(({ hot, expectObservable }) => {
                // Arrange
                jasmine.clock().mockDate(new Date(0));
                const startEvent: MatchStateChangedEvent = {
                    startDate: new Date(),
                    state: MatchState.Active,
                    matchId: "test",
                };

                const mockConfig = {
                    assumptions: {
                        opponentShieldDefault: 26,
                        opponentHealthDefault: 92,
                    },
                    facts: {
                        maxShield: 151,
                        maxHealth: 142,
                    },
                };
                config.mockSetConfig(mockConfig as Configuration);
                matchService.startedEvent$.next(startEvent);
                matchService.state$.next(startEvent);
                matchPlayerService.myState$.next(PlayerState.Alive);
                matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

                // Act
                const damageEvent: MatchInflictionEvent = {
                    timestamp: new Date(),
                    victim: { name: "Victim1", isMe: false },
                    attacker: { name: "Me", isMe: true },
                    hasShield: false,
                    isHeadshot: false,
                    shieldDamage: 0,
                    healthDamage: 92,
                    isKnockdown: true,
                    isElimination: true,
                    weapon: new WeaponItem({}),
                };
                hot("a", { a: damageEvent }).subscribe(matchPlayerInflictionService.myDamageEvent$);

                const expectedInflictionAccum: MatchInflictionEventAccum = {
                    victim: { name: "Victim1", isMe: false },
                    shieldDamageSum: 0,
                    healthDamageSum: 92,
                    hasShield: false,
                    isKnocked: true,
                    isEliminated: true,
                    latestAttacker: { name: "Me", isMe: true },
                    latestTimestamp: new Date(),
                };
                const expectedValue: OpponentBanner[] = [
                    {
                        isIndirectBanner: false,
                        rosterPlayer: expectedInflictionAccum.victim!,
                        latestInflictionAccum: expectedInflictionAccum,
                        maybeMaxShield: 0,
                        maybeShieldAmount: 26,
                        maybeHealthAmount: 0,
                    },
                ];

                // Assert
                const actual = of(sut.opponentBannerList);
                expectObservable(actual).toBe("(a|)", { a: expectedValue });
            });
        });
    });

    it("resets/hides damage aggregate sum to one opponent after a timeout period", fakeAsync(() => {
        // Arrange
        const victim = { name: "ShieldANDHealthDamage", isMe: false };
        const mockConfig = {
            assumptions: {
                opponentShieldDefault: 26,
                opponentHealthDefault: 92,
            },
            facts: {
                maxShield: 151,
                maxHealth: 142,
            },
            featureConfigs: {
                inflictionInsight: {
                    damageResetTime: 5000,
                },
            },
        };
        config.mockSetConfig(mockConfig as Configuration);
        const startEvent: MatchStateChangedEvent = {
            startDate: new Date("2020-01-01T00:00:00"),
            state: MatchState.Active,
            matchId: "test",
        };
        jasmine.clock().mockDate(startEvent.startDate);

        // Act
        matchService.startedEvent$.next(startEvent);
        matchService.state$.next(startEvent);
        matchPlayerService.myState$.next(PlayerState.Alive);
        matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

        const damageTimestamp = new Date();
        const baseDamageEvent: MatchInflictionEvent = {
            timestamp: damageTimestamp,
            victim: victim,
            attacker: { name: "Me", isMe: true, teamId: 1 },
            hasShield: false,
            shieldDamage: 0,
            healthDamage: 0,
        };
        const shieldDamageEvent: MatchInflictionEvent = { ...baseDamageEvent, shieldDamage: 13, hasShield: true };
        const healthDamageEvent: MatchInflictionEvent = { ...baseDamageEvent, healthDamage: 34, hasShield: false };
        matchPlayerInflictionService.myDamageEvent$.next(shieldDamageEvent);
        matchPlayerInflictionService.myDamageEvent$.next(shieldDamageEvent);
        matchPlayerInflictionService.myDamageEvent$.next(healthDamageEvent);
        matchPlayerInflictionService.myDamageEvent$.next(healthDamageEvent);
        matchPlayerInflictionService.myDamageEvent$.next(healthDamageEvent);
        tick(5000);

        const expectedAccum: MatchInflictionEventAccum = {
            victim: victim,
            hasShield: false,
            shieldDamageSum: 26,
            healthDamageSum: 102,
            isEliminated: false,
            isKnocked: false,
            latestAttacker: { name: "Me", isMe: true, teamId: 1 },
            latestTimestamp: damageTimestamp,
        };
        const expectedBannerList: OpponentBanner[] = [
            {
                isIndirectBanner: false,
                rosterPlayer: victim,
                maybeMaxShield: 26,
                maybeShieldAmount: 0,
                maybeHealthAmount: 0,
                latestInflictionAccum: expectedAccum,
            },
        ];
        expect(sut.opponentBannerList).toEqual(expectedBannerList);
        discardPeriodicTasks();
    }));

    it("resets/hides damage aggregate sum to many enemies after a timeout period", fakeAsync(() => {
        // Arrange
        const victim1 = { name: "ShieldANDHealthDamage1", isMe: false };
        const victim2 = { name: "ShieldANDHealthDamage2", isMe: false };
        const victim3 = { name: "ShieldANDHealthDamage3", isMe: false };
        const attacker = { name: "Me", isMe: true, teamId: 1 };
        const mockConfig = {
            assumptions: {
                opponentShieldDefault: 26,
                opponentHealthDefault: 92,
            },
            facts: {
                maxShield: 151,
                maxHealth: 142,
            },
            featureConfigs: {
                inflictionInsight: {
                    damageResetTime: 5000,
                },
            },
        };
        config.mockSetConfig(mockConfig as Configuration);
        const startEvent: MatchStateChangedEvent = {
            startDate: new Date("2020-01-01T00:00:00"),
            state: MatchState.Active,
            matchId: "test",
        };
        jasmine.clock().mockDate(startEvent.startDate);

        // Act
        matchService.startedEvent$.next(startEvent);
        matchService.state$.next(startEvent);
        matchPlayerService.myState$.next(PlayerState.Alive);
        matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

        (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim: victim1, shieldDamage: 12, attacker });
        tick(1000);
        (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim: victim2, shieldDamage: 45, attacker });
        tick(1000);
        (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim: victim3, shieldDamage: 78, attacker });
        tick(1000);
        (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim: victim1, healthDamage: 21, attacker });
        const damageTimestamp1 = new Date();
        tick(1000);
        (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim: victim2, healthDamage: 54, attacker });
        const damageTimestamp2 = new Date();
        tick(1000);
        (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim: victim3, healthDamage: 87, attacker });
        const damageTimestamp3 = new Date();
        tick(1000);
        tick(10000);

        const expectedAccum1: MatchInflictionEventAccum = {
            victim: victim1,
            hasShield: false,
            shieldDamageSum: 12,
            healthDamageSum: 21,
            isEliminated: false,
            isKnocked: false,
            latestAttacker: attacker,
            latestTimestamp: damageTimestamp1,
        };
        const expectedAccum2: MatchInflictionEventAccum = {
            victim: victim2,
            hasShield: false,
            shieldDamageSum: 45,
            healthDamageSum: 54,
            isEliminated: false,
            isKnocked: false,
            latestAttacker: attacker,
            latestTimestamp: damageTimestamp2,
        };
        const expectedAccum3: MatchInflictionEventAccum = {
            victim: victim3,
            hasShield: false,
            shieldDamageSum: 78,
            healthDamageSum: 87,
            isEliminated: false,
            isKnocked: false,
            latestAttacker: attacker,
            latestTimestamp: damageTimestamp3,
        };
        const expectedBannerList: OpponentBanner[] = [
            {
                isIndirectBanner: false,
                rosterPlayer: victim3,
                maybeMaxShield: 78,
                maybeShieldAmount: 0,
                maybeHealthAmount: 5,
                latestInflictionAccum: expectedAccum3,
            },
            {
                isIndirectBanner: false,
                rosterPlayer: victim2,
                maybeMaxShield: 45,
                maybeShieldAmount: 0,
                maybeHealthAmount: 38,
                latestInflictionAccum: expectedAccum2,
            },
            {
                isIndirectBanner: false,
                rosterPlayer: victim1,
                maybeMaxShield: 12,
                maybeShieldAmount: 0,
                maybeHealthAmount: 71,
                latestInflictionAccum: expectedAccum1,
            },
        ];

        expect(sut.opponentBannerList).toEqual(expectedBannerList);
        discardPeriodicTasks();
    }));

    // it("shows opponent teammates after a damage event", () => {});

    // it("shows the teammates of a damaged opponent", () => {});

    // TODO
    xdescribe("bugfix attempt", () => {
        it("infliction insight not disappearing", () => {
            scheduler.run(({ cold, expectObservable, flush }) => {
                // Arrange
                const fakeNow = new Date("2020-01-01T00:00:00.000Z");
                const mockConfig = {
                    assumptions: {
                        opponentShieldDefault: 75,
                        opponentHealthDefault: 100,
                        knockdownExpireTime: 10000,
                        eliminationExpireTime: 300000,
                    },
                    facts: {
                        maxShield: 125,
                        maxHealth: 100,
                    },
                    featureConfigs: {
                        inflictionInsight: {
                            damageResetTime: 5000,
                        },
                    },
                    featureFlags: {
                        inflictionInsight: {
                            assumeKnockdownExpires: true,
                            assumeEliminationExpires: true,
                            showAssumedOpponentTeammateShields: false,
                            showAssumedOpponentTeammateHealth: false,
                        },
                    },
                };
                const myName = "Me";
                const rosterMe: MatchRosterPlayer = {
                    name: myName,
                    isMe: true,
                    teamId: 1,
                };
                const rosterMyEnemys: MatchRosterPlayer[] = [
                    {
                        name: "Victim1",
                        isMe: false,
                        teamId: 2,
                    },
                    {
                        name: "Victim2",
                        isMe: false,
                        teamId: 2,
                    },
                    {
                        name: "Victim3",
                        isMe: false,
                        teamId: 2,
                    },
                    {
                        name: "Victim4",
                        isMe: false,
                        teamId: 3,
                    },
                    {
                        name: "Victim5",
                        isMe: false,
                        teamId: 3,
                    },
                    {
                        name: "Victim6",
                        isMe: false,
                        teamId: 3,
                    },
                ];
                const matchStartEvent: MatchStateChangedEvent = {
                    startDate: fakeNow,
                    matchId: "test",
                    state: MatchState.Active,
                };
                const roster = new MatchRoster();
                roster.addPlayer(rosterMe);
                rosterMyEnemys.forEach((rosterMyEnemy) => roster.addPlayer(rosterMyEnemy));
                const weapon = new WeaponItem({ fromId: "r301" });
                const weaponSlots: InventorySlots<WeaponItem> = {
                    0: {
                        item: weapon,
                    },
                };

                // Act
                jasmine.clock().mockDate(fakeNow);
                config.mockSetConfig(mockConfig as Configuration);
                const frame = scheduler.createTime("-|");
                cold("T|", { T: frame }).subscribe((tickDuration) => jasmine.clock().tick(tickDuration));
                cold("a----------------------------------", { a: matchStartEvent }).subscribe(matchService.state$);
                cold("a----------------------------------", { a: matchStartEvent }).subscribe(matchService.startedEvent$);
                cold("a----------------------------------", { a: roster }).subscribe(matchRosterService.matchRoster$);
                cold("a----------------------------------", { a: PlayerState.Alive }).subscribe(matchPlayerService.myState$);
                cold("abc--------------------------------", {
                    a: MatchLocationPhase.Dropship,
                    b: MatchLocationPhase.Dropping,
                    c: MatchLocationPhase.HasLanded,
                }).subscribe(matchPlayerLocationService.myLocationPhase$);
                cold("---abcdefghijklmnopqrstuvwxyzABCDEF", {
                    a: createInfliction(rosterMyEnemys[0].name, myName, 0, 5, 0, true, false, false), // hit shield #1
                    b: createInfliction(rosterMyEnemys[0].name, myName, 1, 0, 20, false, false, false), // hit health #1
                    c: createInfliction(rosterMyEnemys[1].name, myName, 2, 5, 0, true, false, false), // hit shield #2
                    d: createInfliction(rosterMyEnemys[0].name, myName, 3, 0, 5, false, true, false), // knocked #1
                    e: createInfliction(rosterMyEnemys[1].name, myName, 4, 0, 20, false, false, false), // hit health #2
                    f: createInfliction(rosterMyEnemys[1].name, myName, 5, 0, 5, false, true, false), // knocked #2
                    g: createInfliction(rosterMyEnemys[0].name, myName, 6, 0, 20, false, false, false), // thirst #1
                    h: createInfliction(rosterMyEnemys[0].name, myName, 7, 0, 20, false, false, false), // thirst #1
                    i: createInfliction(rosterMyEnemys[3].name, myName, 8, 5, 0, true, false, false), // hit shield #4
                    j: createInfliction(rosterMyEnemys[0].name, myName, 9, 0, 20, false, false, false), // thirst #1
                    k: createInfliction(rosterMyEnemys[0].name, myName, 10, 0, 20, false, false, false), // thirst #1
                    l: createInfliction(rosterMyEnemys[0].name, myName, 11, 0, 5, false, false, true), // eliminated #1
                    m: createInfliction(rosterMyEnemys[1].name, myName, 12, 0, 20, false, false, false), // thirst #2
                    n: createInfliction(rosterMyEnemys[2].name, myName, 13, 5, 0, true, false, false), // hit shield #3
                    o: createInfliction(rosterMyEnemys[1].name, myName, 14, 0, 20, false, false, false), // thirst #2
                    p: createInfliction(rosterMyEnemys[1].name, myName, 15, 0, 20, false, false, false), // thirst #2
                    q: createInfliction(rosterMyEnemys[2].name, myName, 16, 0, 20, false, false, false), // hit health #3
                    r: createInfliction(rosterMyEnemys[2].name, myName, 17, 0, 5, false, true, false), // knocked #3
                    s: createInfliction(rosterMyEnemys[1].name, myName, 18, 0, 20, false, false, false), // thirst #2
                    t: createInfliction(rosterMyEnemys[1].name, myName, 19, 0, 5, false, false, true), // eliminated #2
                    u: createInfliction(rosterMyEnemys[2].name, myName, 20, 0, 20, false, false, false), // thirst #3
                    v: createInfliction(rosterMyEnemys[2].name, myName, 21, 0, 20, false, false, false), // thirst #3
                    w: createInfliction(rosterMyEnemys[3].name, myName, 22, 0, 20, false, false, false), // hit health #4
                    x: createInfliction(rosterMyEnemys[3].name, myName, 23, 0, 5, false, true, false), // knocked #4
                    y: createInfliction(rosterMyEnemys[2].name, myName, 24, 0, 20, false, false, false), // thirst #3
                    z: createInfliction(rosterMyEnemys[2].name, myName, 25, 0, 20, false, false, false), // thirst #3
                    A: createInfliction(rosterMyEnemys[3].name, myName, 26, 0, 20, false, false, false), // thirst #4
                    B: createInfliction(rosterMyEnemys[3].name, myName, 27, 0, 20, false, false, false), // thirst #4
                    C: createInfliction(rosterMyEnemys[3].name, myName, 28, 0, 20, false, false, false), // thirst #4
                    D: createInfliction(rosterMyEnemys[2].name, myName, 29, 0, 5, false, false, true), // eliminated #3
                    E: createInfliction(rosterMyEnemys[3].name, myName, 30, 0, 20, false, false, false), // thirst #4
                    F: createInfliction(rosterMyEnemys[3].name, myName, 31, 0, 5, false, false, true), // eliminated #4
                }).subscribe(matchPlayerInflictionService.myDamageEvent$);
                // cold("---a--", { a: {} }).subscribe(matchPlayerInflictionService.myKillfeedEvent$);

                // Assert
                // expectObservable().toBe("---a--", {

                // });
                cold("").subscribe(() => {});
                flush();
                console.log(sut.opponentBannerList);
                expect(sut.opponentBannerList).toBeTruthy();
            });
        });
    });
});
