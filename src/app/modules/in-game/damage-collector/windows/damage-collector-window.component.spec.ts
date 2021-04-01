import { ChangeDetectorRef } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatchPlayerInflictionService } from "@core/match/match-player-infliction.service";
import { MatchPlayerLocationService } from "@core/match/match-player-location.service";
import { MatchPlayerService } from "@core/match/match-player.service";
import { MatchRosterService } from "@core/match/match-roster.service";
import { MatchService } from "@core/match/match.service";
import { MockUIContainerComponent } from "@core/mocks/components/mock-ui-container.component";
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
import { DamageCollectorWindowComponent } from "./damage-collector-window.component";

describe("DamageCollectorWindowComponent", () => {
    let sut: DamageCollectorWindowComponent;
    let fixture: ComponentFixture<DamageCollectorWindowComponent>;
    let scheduler: TestScheduler;
    let matchPlayerInflictionService: MockMatchPlayerInflictionService | MatchPlayerInflictionService;
    let matchPlayerLocationService: MockMatchPlayerLocationService | MatchPlayerLocationService;
    let matchPlayerService: MockMatchPlayerService | MatchPlayerService;
    let matchRosterService: MockMatchRosterService | MatchRosterService;
    let matchService: MockMatchService | MatchService;
    let playerService: MockPlayerService | PlayerService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DamageCollectorWindowComponent, MockUIContainerComponent],
            providers: [
                { provide: ChangeDetectorRef, useValue: {} },
                { provide: MatchPlayerInflictionService, useClass: MockMatchPlayerInflictionService },
                { provide: MatchPlayerLocationService, useClass: MockMatchPlayerLocationService },
                { provide: MatchPlayerService, useClass: MockMatchPlayerService },
                { provide: MatchRosterService, useClass: MockMatchRosterService },
                { provide: MatchService, useClass: MockMatchService },
                { provide: PlayerService, useClass: MockPlayerService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        jasmine.clock().uninstall();
        jasmine.clock().install();
        jasmine.clock().mockDate(new Date(0));
        scheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
        scheduler.maxFrames = 5000;
        fixture = TestBed.createComponent(DamageCollectorWindowComponent);
        sut = fixture.componentInstance;
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

    it("hides when player is knocked", () => {
        // Arrange
        const startEvent: MatchStateChangedEvent = {
            startDate: new Date(),
            state: MatchState.Active,
        };

        // Act
        matchService.startedEvent$.next(startEvent);
        matchService.state$.next(startEvent);
        matchPlayerService.myState$.next(PlayerState.Alive);
        matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

        matchPlayerService.myState$.next(PlayerState.Knocked);

        // Assert
        const actual = sut.isVisible;
        expect(actual).toBeFalse();
    });

    it("hides when player is eliminated", () => {
        // Arrange
        const startEvent: MatchStateChangedEvent = {
            startDate: new Date(),
            state: MatchState.Active,
        };

        // Act
        matchService.startedEvent$.next(startEvent);
        matchService.state$.next(startEvent);
        matchPlayerService.myState$.next(PlayerState.Alive);
        matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

        matchPlayerService.myState$.next(PlayerState.Eliminated);

        // Assert
        const actual = sut.isVisible;
        expect(actual).toBeFalse();
    });

    it("hides on match end", () => {
        // Arrange
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

        // Act
        matchService.endedEvent$.next(endEvent);
        matchService.state$.next(endEvent);

        // Assert
        const actual = sut.isVisible;
        expect(actual).toBeFalse();
    });

    // it("shows an enemy after a damage event", () => {
    //     scheduler.run(({ hot, expectObservable }) => {
    //         // Arrange
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
    //         const expectedValue: EnemyBadge[] = [
    //             {
    //                 isTeammate: false,
    //                 rosterPlayer: expectedInflictionAccum.victim!,
    //                 latestInflictionAccum: expectedInflictionAccum,
    //             },
    //         ];

    //         // Assert
    //         const actual = of(sut.enemyBadgeList);
    //         expectObservable(actual).toBe("a", { a: expectedValue });
    //     });
    // });

    // it("shows an enemy after a knockdown event", () => {
    //     scheduler.run(({ hot, expectObservable }) => {
    //         // Arrange
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
    //         const expectedValue: EnemyBadge[] = [
    //             {
    //                 isTeammate: false,
    //                 rosterPlayer: expectedInflictionAccum.victim!,
    //                 latestInflictionAccum: expectedInflictionAccum,
    //             },
    //         ];

    //         // Assert
    //         const actual = of(sut.enemyBadgeList);
    //         expectObservable(actual).toBe("a", { a: expectedValue });
    //     });
    // });

    // TODO:
    // it("shows an enemy after an elimination event", () => {
    //     scheduler.run(({ hot, cold, expectObservable, flush }) => {
    //         // Arrange
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
    //         console.log(sut.enemyBadgeList);
    //         const actual = cold(actualMarble, { a: sut.enemyBadgeList });

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
    //         const expectedValue: EnemyBadge[] = [
    //             {
    //                 isTeammate: false,
    //                 rosterPlayer: expectedInflictionAccum.victim!,
    //                 latestInflictionAccum: expectedInflictionAccum,
    //             },
    //         ];

    //         const expectedResetValue: EnemyBadge[] = [];

    //         // Assert
    //         expectObservable(actual).toBe(expectMarble, { a: expectedValue, b: expectedResetValue });
    //     });
    // });

    // it("resets/hides damage aggregate sum to one enemy after a timeout period", fakeAsync(() => {
    //     // Arrange
    //     let subscribeCalled = false;
    //     const victim = { name: "ShieldANDHealthDamage" };
    //     const startEvent: MatchStateChangedEvent = {
    //         startDate: new Date("2020-01-01T00:00:00"),
    //         state: MatchState.Active,
    //     };
    //     jasmine.clock().mockDate(startEvent.startDate);

    //     sut.enemyBadgeList$.pipe(skip(6), take(1)).subscribe((enemyBadgeList) => {
    //         // Assert
    //         const expectedShieldDamage = 0;
    //         const expectedHealthDamage = 0;
    //         const victimBadge = enemyBadgeList.find((d) => isPlayerNameEqual(d.rosterPlayer.name, victim.name));
    //         expect(victimBadge?.latestDamageAggregate?.shieldDamage).toBe(expectedShieldDamage);
    //         expect(victimBadge?.latestDamageAggregate?.healthDamage).toBe(expectedHealthDamage);
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

    //     sut.enemyBadgeList$.pipe(skip(8), take(1)).subscribe((enemyBadgeList) => {
    //         // Assert
    //         const expectedShieldDamage = 0;
    //         const expectedHealthDamage = 0;
    //         const victimBadge1 = enemyBadgeList.find((d) => isPlayerNameEqual(d.rosterPlayer.name, victim1.name));
    //         expect(victimBadge1?.latestDamageAggregate?.shieldDamage).toBe(expectedShieldDamage);
    //         expect(victimBadge1?.latestDamageAggregate?.healthDamage).toBe(expectedHealthDamage);

    //         const victimBadge2 = enemyBadgeList.find((d) => isPlayerNameEqual(d.rosterPlayer.name, victim2.name));
    //         expect(victimBadge2?.latestDamageAggregate?.shieldDamage).toBe(expectedShieldDamage);
    //         expect(victimBadge2?.latestDamageAggregate?.healthDamage).toBe(expectedHealthDamage);

    //         const victimBadge3 = enemyBadgeList.find((d) => isPlayerNameEqual(d.rosterPlayer.name, victim3.name));
    //         expect(victimBadge3?.latestDamageAggregate?.shieldDamage).toBe(expectedShieldDamage);
    //         expect(victimBadge3?.latestDamageAggregate?.healthDamage).toBe(expectedHealthDamage);
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

    // it("shows enemy teammates after a damage event", () => {});

    // it("shows the teammates of a damaged enemy", () => {});
});
