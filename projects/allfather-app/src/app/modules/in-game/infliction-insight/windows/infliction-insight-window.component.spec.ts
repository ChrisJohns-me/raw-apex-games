import { ConfigurationService } from "@allfather-app/app/modules/core/configuration.service";
import { MatchActivityService } from "@allfather-app/app/modules/core/match/match-activity.service";
import { MatchPlayerInflictionService } from "@allfather-app/app/modules/core/match/match-player-infliction.service";
import { MatchPlayerLocationService } from "@allfather-app/app/modules/core/match/match-player-location.service";
import { MatchPlayerService } from "@allfather-app/app/modules/core/match/match-player.service";
import { MatchRosterService } from "@allfather-app/app/modules/core/match/match-roster.service";
import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { MockOpponentBannerComponent } from "@allfather-app/app/modules/core/mocks/components/mock-opponent-banner.component";
import { MockUIContainerComponent } from "@allfather-app/app/modules/core/mocks/components/mock-ui-container.component";
import { MockConfigurationService } from "@allfather-app/app/modules/core/mocks/services/mock-configuration.service";
import { MockMatchActivityService } from "@allfather-app/app/modules/core/mocks/services/mock-match-activity.service";
import { MockMatchPlayerInflictionService } from "@allfather-app/app/modules/core/mocks/services/mock-match-player-infliction.service";
import { MockMatchPlayerLocationService } from "@allfather-app/app/modules/core/mocks/services/mock-match-player-location.service";
import { MockMatchPlayerService } from "@allfather-app/app/modules/core/mocks/services/mock-match-player.service";
import { MockMatchRosterService } from "@allfather-app/app/modules/core/mocks/services/mock-match-roster.service";
import { MockMatchService } from "@allfather-app/app/modules/core/mocks/services/mock-match.service";
import { MockPlayerService } from "@allfather-app/app/modules/core/mocks/services/mock-player.service";
import { PlayerService } from "@allfather-app/app/modules/core/player.service";
import { WeaponItem } from "@allfather-app/app/shared/models/items/weapon-item";
import { MatchInflictionEvent, MatchInflictionEventAccum } from "@allfather-app/app/shared/models/match/infliction-event";
import { MatchLocationPhase } from "@allfather-app/app/shared/models/match/location";
import { MatchState, MatchStateChangedEvent } from "@allfather-app/app/shared/models/match/state";
import { PlayerState } from "@allfather-app/app/shared/models/player-state";
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
    let config: ConfigurationService;
    let matchActivityService: MatchActivityService;
    let matchPlayerInflictionService: MatchPlayerInflictionService;
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
                { provide: MatchService, useClass: MockMatchService },
                { provide: MatchActivityService, useClass: MockMatchActivityService },
                { provide: MatchPlayerService, useClass: MockMatchPlayerService },
                { provide: MatchPlayerInflictionService, useClass: MockMatchPlayerInflictionService },
                { provide: MatchPlayerLocationService, useClass: MockMatchPlayerLocationService },
                { provide: MatchRosterService, useClass: MockMatchRosterService },
                { provide: PlayerService, useClass: MockPlayerService },
            ],
        }).compileComponents();
    });

    beforeEach(async () => {
        jasmine.clock().uninstall();
        jasmine.clock().install();
        scheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
        fixture = TestBed.createComponent(InflictionInsightWindowComponent);
        sut = fixture.componentInstance;
        config = TestBed.inject(ConfigurationService);
        matchPlayerInflictionService = TestBed.inject(MatchPlayerInflictionService);
        matchPlayerLocationService = TestBed.inject(MatchPlayerLocationService);
        matchPlayerService = TestBed.inject(MatchPlayerService);
        matchRosterService = TestBed.inject(MatchRosterService);
        matchService = TestBed.inject(MatchService);
        fixture.detectChanges(); // ngOnInit
    });

    afterEach(() => {
        fixture.destroy();
    });

    it("should be created", () => {
        expect(sut).toBeDefined();
    });

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
            config.assumptions.opponentShieldDefault = 76;
            config.assumptions.opponentHealthDefault = 101;
            config.facts.maxShield = 130;
            config.facts.maxHealth = 101;
            matchService.startedEvent$.next(startEvent);
            matchService.state$.next(startEvent);
            matchPlayerService.myState$.next(PlayerState.Alive);
            matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

            // Act
            const actualValue: MatchInflictionEvent = {
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
            hot("a|", { a: actualValue }).subscribe(matchPlayerInflictionService.myDamageEvent$);

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
            config.assumptions.opponentShieldDefault = 26;
            config.assumptions.opponentHealthDefault = 92;
            config.facts.maxShield = 151;
            config.facts.maxHealth = 142;
            matchService.startedEvent$.next(startEvent);
            matchService.state$.next(startEvent);
            matchPlayerService.myState$.next(PlayerState.Alive);
            matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

            // Act
            const actualValue: MatchInflictionEvent = {
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
            hot("a", { a: actualValue }).subscribe(matchPlayerInflictionService.myDamageEvent$);

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
            config.assumptions.opponentShieldDefault = 26;
            config.assumptions.opponentHealthDefault = 92;
            config.facts.maxShield = 151;
            config.facts.maxHealth = 142;
            matchService.startedEvent$.next(startEvent);
            matchService.state$.next(startEvent);
            matchPlayerService.myState$.next(PlayerState.Alive);
            matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

            // Act
            const actualValue: MatchInflictionEvent = {
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
            hot("a", { a: actualValue }).subscribe(matchPlayerInflictionService.myDamageEvent$);

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

    it("resets/hides damage aggregate sum to one opponent after a timeout period", fakeAsync(() => {
        // Arrange
        const victim = { name: "ShieldANDHealthDamage", isMe: false };
        config.assumptions.opponentShieldDefault = 26;
        config.assumptions.opponentHealthDefault = 92;
        config.facts.maxShield = 151;
        config.facts.maxHealth = 142;
        config.featureConfigs.inflictionInsight.damageResetTime = 5000;
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

    // it("resets/hides damage aggregate sum to many enemies after a timeout period", fakeAsync(() => {
    //     // Arrange
    //     let subscribeCalled = false;
    //     const victim1 = { name: "ShieldANDHealthDamage1" };
    //     const victim2 = { name: "ShieldANDHealthDamage2" };
    //     const victim3 = { name: "ShieldANDHealthDamage3" };
    //     const startEvent: MatchStateChangedEvent = {
    //         startDate: new Date("2020-01-01T00:00:00"),
    //         state: MatchState.Active,
    //         matchId: "test"
    //     };
    //     jasmine.clock().mockDate(startEvent.startDate);

    //     sut.OpponentBannerList$.pipe(skip(8), take(1)).subscribe((OpponentBannerList) => {
    //         // Assert
    //         const expectedShieldDamage = 0;
    //         const expectedHealthDamage = 0;
    //         const opponentBanner1 = OpponentBannerList.find((d) => isPlayerNameEqual(d.rosterPlayer.name, victim1.name));
    //         expect(opponentBanner1?.latestDamageAggregate?.shieldDamage).toBe(expectedShieldDamage);
    //         expect(opponentBanner1?.latestDamageAggregate?.healthDamage).toBe(expectedHealthDamage);

    //         const opponentBanner2 = OpponentBannerList.find((d) => isPlayerNameEqual(d.rosterPlayer.name, victim2.name));
    //         expect(opponentBanner2?.latestDamageAggregate?.shieldDamage).toBe(expectedShieldDamage);
    //         expect(opponentBanner2?.latestDamageAggregate?.healthDamage).toBe(expectedHealthDamage);

    //         const opponentBanner3 = OpponentBannerList.find((d) => isPlayerNameEqual(d.rosterPlayer.name, victim3.name));
    //         expect(opponentBanner3?.latestDamageAggregate?.shieldDamage).toBe(expectedShieldDamage);
    //         expect(opponentBanner3?.latestDamageAggregate?.healthDamage).toBe(expectedHealthDamage);
    //         subscribeCalled = true;
    //     });

    //     // Act
    //     matchService.startedEvent$.next(startEvent);
    //     matchService.state$.next(startEvent);
    //     matchPlayerService.myState$.next(PlayerState.Alive);
    //     matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim: victim1, shieldDamage: 12 });
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim: victim2, shieldDamage: 45 });
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim: victim3, shieldDamage: 78 });
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim: victim1, healthDamage: 21 });
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim: victim2, healthDamage: 54 });
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim: victim3, healthDamage: 87 });
    //     tick(1000);
    //     tick(10000);

    //     discardPeriodicTasks();
    //     expect(subscribeCalled).toBeTrue();
    // }));

    // it("shows opponent teammates after a damage event", () => {});

    // it("shows the teammates of a damaged opponent", () => {});
});
