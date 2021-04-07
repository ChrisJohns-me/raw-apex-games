import { ChangeDetectorRef } from "@angular/core";
import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { ConfigurationService } from "@core/configuration/configuration.service";
import { MatchPlayerInflictionService } from "@core/match/match-player-infliction.service";
import { MatchPlayerLocationService } from "@core/match/match-player-location.service";
import { MatchPlayerService } from "@core/match/match-player.service";
import { MatchRosterService } from "@core/match/match-roster.service";
import { MatchService } from "@core/match/match.service";
import { MockUIContainerComponent } from "@core/mocks/components/mock-ui-container.component";
import { MockConfigurationService } from "@core/mocks/services/mock-configuration.service";
import { MockMatchPlayerInflictionService } from "@core/mocks/services/mock-match-player-infliction.service";
import { MockMatchPlayerLocationService } from "@core/mocks/services/mock-match-player-location.service";
import { MockMatchPlayerService } from "@core/mocks/services/mock-match-player.service";
import { MockMatchRosterService } from "@core/mocks/services/mock-match-roster.service";
import { MockMatchService } from "@core/mocks/services/mock-match.service";
import { MockPlayerService } from "@core/mocks/services/mock-player.service";
import { PlayerService } from "@core/player.service";
import { MatchLocationPhase } from "@shared/models/match/match-location";
import { MatchState, MatchStateChangedEvent } from "@shared/models/match/match-state";
import { PlayerState } from "@shared/models/player-state";
import { TestScheduler } from "rxjs/testing";
import { InflictionInsightWindowComponent } from "./infliction-insight-window.component";

describe("InflictionInsightWindowComponent", () => {
    let sut: InflictionInsightWindowComponent;
    let fixture: ComponentFixture<InflictionInsightWindowComponent>;
    let scheduler: TestScheduler;
    let config: ConfigurationService;
    let matchPlayerInflictionService: MatchPlayerInflictionService;
    let matchPlayerLocationService: MatchPlayerLocationService;
    let matchPlayerService: MatchPlayerService;
    let matchRosterService: MatchRosterService;
    let matchService: MatchService;
    let playerService: PlayerService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InflictionInsightWindowComponent, MockUIContainerComponent],
            providers: [
                { provide: ChangeDetectorRef, useValue: {} },
                { provide: ConfigurationService, useClass: MockConfigurationService },
                { provide: MatchPlayerInflictionService, useClass: MockMatchPlayerInflictionService },
                { provide: MatchPlayerLocationService, useClass: MockMatchPlayerLocationService },
                { provide: MatchPlayerService, useClass: MockMatchPlayerService },
                { provide: MatchRosterService, useClass: MockMatchRosterService },
                { provide: MatchService, useClass: MockMatchService },
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
        scheduler.maxFrames = 5000;
        fixture = TestBed.createComponent(InflictionInsightWindowComponent);
        sut = fixture.componentInstance;
        config = TestBed.inject(ConfigurationService);
        matchPlayerInflictionService = TestBed.inject(MatchPlayerInflictionService);
        matchPlayerLocationService = TestBed.inject(MatchPlayerLocationService);
        matchPlayerService = TestBed.inject(MatchPlayerService);
        matchRosterService = TestBed.inject(MatchRosterService);
        matchService = TestBed.inject(MatchService);
        playerService = TestBed.inject(PlayerService);
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
        };
        const endEvent: MatchStateChangedEvent = {
            startDate: startEvent.startDate,
            endDate: new Date(),
            state: MatchState.Inactive,
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

    // it("shows an opponent after a damage event", () => {
    //     scheduler.run(({ hot, expectObservable }) => {
    //         // Arrange
    //         jasmine.clock().mockDate(new Date(0));
    //         const startEvent: MatchStateChangedEvent = {
    //             startDate: new Date(),
    //             state: MatchState.Active,
    //         };
    //         matchService.startedEvent$.next(startEvent);
    //         matchService.state$.next(startEvent);
    //         matchPlayerService.myState$.next(PlayerState.Alive);
    //         matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

    //         // Act
    //         const actualValue: MatchInflictionEvent = {
    //             timestamp: new Date(),
    //             victim: { name: "Victim1" },
    //             attacker: { name: "Me" },
    //             hasShield: true,
    //             isHeadshot: false,
    //             shieldDamage: 100,
    //             healthDamage: 0,
    //             isKnockdown: false,
    //             isElimination: false,
    //             weapon: new WeaponItem({}),
    //         };
    //         hot("a|", { a: actualValue }).subscribe(matchPlayerInflictionService.myDamageEvent$);

    //         const expectedInflictionAccum: MatchInflictionEventAccum = {
    //             victim: { name: "Victim1" },
    //             shieldDamageSum: 100,
    //             healthDamageSum: 0,
    //             hasShield: true,
    //             isKnocked: false,
    //             isEliminated: false,
    //             latestAttacker: { name: "Me" },
    //             latestTimestamp: new Date(),
    //         };
    //         const expectedValue: OpponentBanner[] = [
    //             {
    //                 isTeammate: false,
    //                 rosterPlayer: expectedInflictionAccum.victim!,
    //                 latestInflictionAccum: expectedInflictionAccum,
    //             },
    //         ];

    //         // Assert
    //         const actual = of(sut.OpponentBannerList);
    //         expectObservable(actual).toBe("a", { a: expectedValue });
    //     });
    // });

    // it("shows an opponent after a knockdown event", () => {
    //     scheduler.run(({ hot, expectObservable }) => {
    //         // Arrange
    //         jasmine.clock().mockDate(new Date(0));
    //         const startEvent: MatchStateChangedEvent = {
    //             startDate: new Date(),
    //             state: MatchState.Active,
    //         };
    //         matchService.startedEvent$.next(startEvent);
    //         matchService.state$.next(startEvent);
    //         matchPlayerService.myState$.next(PlayerState.Alive);
    //         matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

    //         // Act
    //         const actualValue: MatchInflictionEvent = {
    //             timestamp: new Date(),
    //             victim: { name: "Victim1" },
    //             attacker: { name: "Me" },
    //             hasShield: false,
    //             isHeadshot: false,
    //             shieldDamage: 0,
    //             healthDamage: 100,
    //             isKnockdown: true,
    //             isElimination: false,
    //             weapon: new WeaponItem({}),
    //         };
    //         hot("a", { a: actualValue }).subscribe(matchPlayerInflictionService.myDamageEvent$);

    //         const expectedInflictionAccum: MatchInflictionEventAccum = {
    //             victim: { name: "Victim1" },
    //             shieldDamageSum: 0,
    //             healthDamageSum: 100,
    //             hasShield: false,
    //             isKnocked: true,
    //             isEliminated: false,
    //             latestAttacker: { name: "Me" },
    //             latestTimestamp: new Date(),
    //         };
    //         const expectedValue: OpponentBanner[] = [
    //             {
    //                 isTeammate: false,
    //                 rosterPlayer: expectedInflictionAccum.victim!,
    //                 latestInflictionAccum: expectedInflictionAccum,
    //             },
    //         ];

    //         // Assert
    //         const actual = of(sut.OpponentBannerList);
    //         expectObservable(actual).toBe("a", { a: expectedValue });
    //     });
    // });

    // TODO:
    // it("shows an opponent after an elimination event", () => {
    //     scheduler.run(({ hot, cold, expectObservable, flush }) => {
    //         // Arrange
    //         jasmine.clock().mockDate(new Date(0));
    //         const startEvent: MatchStateChangedEvent = {
    //             startDate: new Date(),
    //             state: MatchState.Active,
    //         };
    //         matchService.startedEvent$.next(startEvent);
    //         matchService.state$.next(startEvent);
    //         matchPlayerService.myState$.next(PlayerState.Alive);
    //         matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

    //         // Act
    //         const actualMarble = "a 4999ms --|";
    //         const expectMarble = "a 4999ms -b|";

    //         const actualValue: MatchInflictionEvent = {
    //             timestamp: new Date(),
    //             victim: { name: "Victim1" },
    //             attacker: { name: "Me" },
    //             hasShield: false,
    //             isHeadshot: false,
    //             shieldDamage: 0,
    //             healthDamage: 100,
    //             isKnockdown: true,
    //             isElimination: true,
    //             weapon: new WeaponItem({}),
    //         };
    //         of(actualValue).subscribe(matchPlayerInflictionService.myDamageEvent$);
    //         // flush();
    //         console.log(sut.OpponentBannerList);
    //         const actual = cold(actualMarble, { a: sut.OpponentBannerList });

    //         const expectedInflictionAccum: MatchInflictionEventAccum = {
    //             victim: { name: "Victim1" },
    //             shieldDamageSum: 0,
    //             healthDamageSum: 100,
    //             hasShield: false,
    //             isKnocked: true,
    //             isEliminated: true,
    //             latestAttacker: { name: "Me" },
    //             latestTimestamp: new Date(),
    //         };
    //         const expectedValue: OpponentBanner[] = [
    //             {
    //                 isTeammate: false,
    //                 rosterPlayer: expectedInflictionAccum.victim!,
    //                 latestInflictionAccum: expectedInflictionAccum,
    //             },
    //         ];

    //         const expectedResetValue: OpponentBanner[] = [];

    //         // Assert
    //         expectObservable(actual).toBe(expectMarble, { a: expectedValue, b: expectedResetValue });
    //     });
    // });

    // it("resets/hides damage aggregate sum to one opponent after a timeout period", fakeAsync(() => {
    //     // Arrange
    //     let subscribeCalled = false;
    //     const victim = { name: "ShieldANDHealthDamage" };
    //     const startEvent: MatchStateChangedEvent = {
    //         startDate: new Date("2020-01-01T00:00:00"),
    //         state: MatchState.Active,
    //     };
    //     jasmine.clock().mockDate(startEvent.startDate);

    //     sut.OpponentBannerList$.pipe(skip(6), take(1)).subscribe((OpponentBannerList) => {
    //         // Assert
    //         const expectedShieldDamage = 0;
    //         const expectedHealthDamage = 0;
    //         const opponentBanner = OpponentBannerList.find((d) => isPlayerNameEqual(d.rosterPlayer.name, victim.name));
    //         expect(opponentBanner?.latestDamageAggregate?.shieldDamage).toBe(expectedShieldDamage);
    //         expect(opponentBanner?.latestDamageAggregate?.healthDamage).toBe(expectedHealthDamage);
    //         subscribeCalled = true;
    //     });

    //     // Act
    //     matchService.startedEvent$.next(startEvent);
    //     matchService.state$.next(startEvent);
    //     matchPlayerService.myState$.next(PlayerState.Alive);
    //     matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, shieldDamage: 13 });
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, shieldDamage: 14 });
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, shieldDamage: 15 });
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, healthDamage: 16 });
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, healthDamage: 17 });
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, healthDamage: 18 });

    //     tick(10000);

    //     discardPeriodicTasks();
    //     expect(subscribeCalled).toBeTrue();
    // }));

    // it("resets/hides damage aggregate sum to many enemies after a timeout period", fakeAsync(() => {
    //     // Arrange
    //     let subscribeCalled = false;
    //     const victim1 = { name: "ShieldANDHealthDamage1" };
    //     const victim2 = { name: "ShieldANDHealthDamage2" };
    //     const victim3 = { name: "ShieldANDHealthDamage3" };
    //     const startEvent: MatchStateChangedEvent = {
    //         startDate: new Date("2020-01-01T00:00:00"),
    //         state: MatchState.Active,
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
