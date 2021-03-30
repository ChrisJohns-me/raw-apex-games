import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatchPlayerInflictionService } from "@core/match/match-player-infliction.service";
import { MatchPlayerLocationService } from "@core/match/match-player-location.service";
import { MatchPlayerService } from "@core/match/match-player.service";
import { MatchRosterService } from "@core/match/match-roster.service";
import { MatchService } from "@core/match/match.service";
import { PlayerService } from "@core/player.service";
import { TestScheduler } from "rxjs/testing";
import { MockMatchPlayerInflictionService } from "src/app/mocks/mock-match-player-infliction.service";
import { MockMatchPlayerLocationService } from "src/app/mocks/mock-match-player-location.service";
import { MockMatchPlayerService } from "src/app/mocks/mock-match-player.service";
import { MockMatchRosterService } from "src/app/mocks/mock-match-roster.service";
import { MockMatchService } from "src/app/mocks/mock-match.service";
import { MockPlayerService } from "src/app/mocks/mock-player.service";
import { MockUIContainerComponent } from "src/app/mocks/mock-ui-container.component";
import { InGameDamageCollectorWindowComponent } from "./in-game-damage-collector-window.component";

describe("InGameDamageCollectorWindowComponent", () => {
    let sut: InGameDamageCollectorWindowComponent;
    let fixture: ComponentFixture<InGameDamageCollectorWindowComponent>;
    let scheduler: TestScheduler;
    let matchPlayerInflictionService: MockMatchPlayerInflictionService | MatchPlayerInflictionService;
    let matchPlayerLocationService: MockMatchPlayerLocationService | MatchPlayerLocationService;
    let matchPlayerService: MockMatchPlayerService | MatchPlayerService;
    let matchRosterService: MockMatchRosterService | MatchRosterService;
    let matchService: MockMatchService | MatchService;
    let playerService: MockPlayerService | PlayerService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InGameDamageCollectorWindowComponent, MockUIContainerComponent],
            providers: [
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
        scheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
        scheduler.maxFrames = 5000;
        fixture = TestBed.createComponent(InGameDamageCollectorWindowComponent);
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

    // it("shows on match start and landed", () => {
    //     // Arrange
    //     const startEvent: MatchStateChangedEvent = {
    //         startDate: new Date("2020-01-01T00:00:00"),
    //         state: MatchState.Active,
    //     };

    //     // Act
    //     matchService.startedEvent$.next(startEvent);
    //     matchService.state$.next(startEvent);
    //     matchPlayerService.myState$.next(PlayerState.Alive);
    //     let actual = sut.isVisible;
    //     expect(actual).toBeFalse();

    //     matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);
    //     actual = sut.isVisible;
    //     // Assert

    //     expect(actual).toBeTrue();
    // });

    // it("hides when player is knocked", () => {
    //     // Arrange
    //     const startEvent: MatchStateChangedEvent = {
    //         startDate: new Date("2020-01-01T00:00:00"),
    //         state: MatchState.Active,
    //     };

    //     // Act
    //     matchService.startedEvent$.next(startEvent);
    //     matchService.state$.next(startEvent);
    //     matchPlayerService.myState$.next(PlayerState.Alive);
    //     matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

    //     matchPlayerService.myState$.next(PlayerState.Knocked);

    //     // Assert
    //     const actual = sut.isVisible;
    //     expect(actual).toBeFalse();
    // });

    // it("hides when player is eliminated", () => {
    //     // Arrange
    //     const startEvent: MatchStateChangedEvent = {
    //         startDate: new Date("2020-01-01T00:00:00"),
    //         state: MatchState.Active,
    //     };

    //     // Act
    //     matchService.startedEvent$.next(startEvent);
    //     matchService.state$.next(startEvent);
    //     matchPlayerService.myState$.next(PlayerState.Alive);
    //     matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

    //     matchPlayerService.myState$.next(PlayerState.Eliminated);

    //     // Assert
    //     const actual = sut.isVisible;
    //     expect(actual).toBeFalse();
    // });

    // it("hides on match end", () => {
    //     // Arrange
    //     const startEvent: MatchStateChangedEvent = {
    //         startDate: new Date("2020-01-01T00:00:00"),
    //         state: MatchState.Active,
    //     };
    //     const endEvent: MatchStateChangedEvent = {
    //         startDate: startEvent.startDate,
    //         endDate: new Date("2020-01-01T00:10:00"),
    //         state: MatchState.Inactive,
    //     };
    //     matchService.startedEvent$.next(startEvent);
    //     matchService.state$.next(startEvent);
    //     matchPlayerService.myState$.next(PlayerState.Alive);
    //     matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

    //     // Act
    //     matchService.endedEvent$.next(endEvent);
    //     matchService.state$.next(endEvent);

    //     // Assert
    //     const actual = sut.isVisible;
    //     expect(actual).toBeFalse();
    // });

    // it("shows an enemy after a damage event", () => {
    //     // Arrange
    //     let subscribeCalled = false;
    //     const startEvent: MatchStateChangedEvent = {
    //         startDate: new Date("2020-01-01T00:00:00"),
    //         state: MatchState.Active,
    //     };
    //     jasmine.clock().mockDate(startEvent.startDate);

    //     sut.enemyBadgeList$.pipe(take(1)).subscribe((enemyBadgeList) => {
    //         // Assert
    //         expect(enemyBadgeList.length).toBe(1);
    //         subscribeCalled = true;
    //     });

    //     // Act
    //     matchService.startedEvent$.next(startEvent);
    //     matchService.state$.next(startEvent);
    //     matchPlayerService.myState$.next(PlayerState.Alive);
    //     matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent();
    //     expect(subscribeCalled).toBeTrue();
    // });

    // it("shows an enemy after a knockdown event", () => {
    //     // Arrange
    //     let subscribeCalled = false;
    //     const startEvent: MatchStateChangedEvent = {
    //         startDate: new Date("2020-01-01T00:00:00"),
    //         state: MatchState.Active,
    //     };
    //     jasmine.clock().mockDate(startEvent.startDate);

    //     sut.enemyBadgeList$.pipe(take(1)).subscribe((enemyBadgeList) => {
    //         // Assert
    //         expect(enemyBadgeList.length).toBe(1);
    //         subscribeCalled = true;
    //     });

    //     // Act
    //     matchService.startedEvent$.next(startEvent);
    //     matchService.state$.next(startEvent);
    //     matchPlayerService.myState$.next(PlayerState.Alive);
    //     matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockKillfeedEvent({
    //         isKnockdown: true,
    //     });
    //     expect(subscribeCalled).toBeTrue();
    // });

    // it("shows an enemy after an elimination event", () => {
    //     // Arrange
    //     let subscribeCalled = false;
    //     const startEvent: MatchStateChangedEvent = {
    //         startDate: new Date("2020-01-01T00:00:00"),
    //         state: MatchState.Active,
    //     };
    //     jasmine.clock().mockDate(startEvent.startDate);

    //     sut.enemyBadgeList$.pipe(take(1)).subscribe((enemyBadgeList) => {
    //         // Assert
    //         expect(enemyBadgeList.length).toBe(1);
    //         subscribeCalled = true;
    //     });

    //     // Act
    //     matchService.startedEvent$.next(startEvent);
    //     matchService.state$.next(startEvent);
    //     matchPlayerService.myState$.next(PlayerState.Alive);
    //     matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockKillfeedEvent({
    //         isElimination: true,
    //     });
    //     expect(subscribeCalled).toBeTrue();
    // });

    // it("shows correct shield damage sum after many damage events", fakeAsync(() => {
    //     // Arrange
    //     let subscribeCalled = false;
    //     const victim = { name: "ShieldDamage" };
    //     const startEvent: MatchStateChangedEvent = {
    //         startDate: new Date("2020-01-01T00:00:00"),
    //         state: MatchState.Active,
    //     };
    //     jasmine.clock().mockDate(startEvent.startDate);

    //     sut.enemyBadgeList$.pipe(skip(2), take(1)).subscribe((enemyBadgeList) => {
    //         // Assert
    //         const expectedShieldDamage = 6;
    //         const victimBadge = enemyBadgeList.find((d) => isPlayerNameEqual(d.rosterPlayer.name, victim.name));

    //         expect(victimBadge?.latestDamageAggregate?.shieldDamage).toBe(expectedShieldDamage);
    //         subscribeCalled = true;
    //     });

    //     // Act
    //     matchService.startedEvent$.next(startEvent);
    //     matchService.state$.next(startEvent);
    //     matchPlayerService.myState$.next(PlayerState.Alive);
    //     matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, shieldDamage: 1, hasShield: true });
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, shieldDamage: 2, hasShield: true });
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, shieldDamage: 3, hasShield: true });
    //     tick(1000);

    //     discardPeriodicTasks();
    //     expect(subscribeCalled).toBeTrue();
    // }));

    // it("shows correct health damage sum after many damage events", fakeAsync(() => {
    //     // Arrange
    //     let subscribeCalled = false;
    //     const victim = { name: "HealthDamage" };
    //     const startEvent: MatchStateChangedEvent = {
    //         startDate: new Date("2020-01-01T00:00:00"),
    //         state: MatchState.Active,
    //     };
    //     jasmine.clock().mockDate(startEvent.startDate);

    //     sut.enemyBadgeList$.pipe(skip(2), take(1)).subscribe((enemyBadgeList) => {
    //         // Assert
    //         const expectedHealthDamage = 15;
    //         const victimBadge = enemyBadgeList.find((d) => isPlayerNameEqual(d.rosterPlayer.name, victim.name));
    //         expect(victimBadge?.latestDamageAggregate?.healthDamage).toBe(expectedHealthDamage);
    //         subscribeCalled = true;
    //     });

    //     // Act
    //     matchService.startedEvent$.next(startEvent);
    //     matchService.state$.next(startEvent);
    //     matchPlayerService.myState$.next(PlayerState.Alive);
    //     matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, healthDamage: 4 });
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, healthDamage: 5 });
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, healthDamage: 6 });
    //     tick(1000);

    //     discardPeriodicTasks();
    //     expect(subscribeCalled).toBeTrue();
    // }));

    // it("shows correct health AND shield damage sum after many damage events to one enemy", fakeAsync(() => {
    //     // Arrange
    //     let subscribeCalled = false;
    //     const victim = { name: "ShieldANDHealthDamage" };
    //     const startEvent: MatchStateChangedEvent = {
    //         startDate: new Date("2020-01-01T00:00:00"),
    //         state: MatchState.Active,
    //     };
    //     jasmine.clock().mockDate(startEvent.startDate);

    //     sut.enemyBadgeList$.pipe(skip(5), take(1)).subscribe((enemyBadgeList) => {
    //         // Assert
    //         const expectedShieldDamage = 24;
    //         const expectedHealthDamage = 33;
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

    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, shieldDamage: 7 });
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, shieldDamage: 8 });
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, shieldDamage: 9 });
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, healthDamage: 10 });
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, healthDamage: 11 });
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, healthDamage: 12 });
    //     tick(1000);

    //     discardPeriodicTasks();
    //     expect(subscribeCalled).toBeTrue();
    // }));

    // it("shows correct health AND shield damage sum after many damage events to many enemies", fakeAsync(() => {
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

    //     sut.enemyBadgeList$.pipe(skip(5), take(1)).subscribe((enemyBadgeList) => {
    //         // Assert
    //         const expectedShieldDamage1 = 12;
    //         const expectedHealthDamage1 = 21;
    //         const victimBadge1 = enemyBadgeList.find((d) => isPlayerNameEqual(d.rosterPlayer.name, victim1.name));
    //         expect(victimBadge1?.latestDamageAggregate?.shieldDamage).toBe(expectedShieldDamage1);
    //         expect(victimBadge1?.latestDamageAggregate?.healthDamage).toBe(expectedHealthDamage1);
    //         const expectedShieldDamage2 = 45;
    //         const expectedHealthDamage2 = 54;
    //         const victimBadge2 = enemyBadgeList.find((d) => isPlayerNameEqual(d.rosterPlayer.name, victim2.name));
    //         expect(victimBadge2?.latestDamageAggregate?.shieldDamage).toBe(expectedShieldDamage2);
    //         expect(victimBadge2?.latestDamageAggregate?.healthDamage).toBe(expectedHealthDamage2);
    //         const expectedShieldDamage3 = 78;
    //         const expectedHealthDamage3 = 87;
    //         const victimBadge3 = enemyBadgeList.find((d) => isPlayerNameEqual(d.rosterPlayer.name, victim3.name));
    //         expect(victimBadge3?.latestDamageAggregate?.shieldDamage).toBe(expectedShieldDamage3);
    //         expect(victimBadge3?.latestDamageAggregate?.healthDamage).toBe(expectedHealthDamage3);
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

    //     discardPeriodicTasks();
    //     expect(subscribeCalled).toBeTrue();
    // }));

    // it("resets damage aggregate sum to one enemy after a timeout period", fakeAsync(() => {
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

    // it("resets damage aggregate sum to many enemies after a timeout period", fakeAsync(() => {
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

    // // TODO: There may be an error in 'damage-timely-aggregator.ts', sending more updates the second time around.
    // fit("resets damage aggregate sum to one enemy after a timeout period, and re-aggregates damage again", fakeAsync(() => {
    //     // Arrange
    //     let subscribeCalled = false;
    //     const victim = { name: "ShieldANDHealthDamage" };
    //     const startEvent: MatchStateChangedEvent = {
    //         startDate: new Date("2020-01-01T00:00:00"),
    //         state: MatchState.Active,
    //     };
    //     jasmine.clock().mockDate(startEvent.startDate);

    //     let count = 0;
    //     // sut.enemyBadgeList$.pipe(skip(13), take(1)).subscribe((enemyBadgeList) => {
    //     sut.enemyBadgeList$.pipe().subscribe((enemyBadgeList) => {
    //         count++;
    //         console.log(count);
    //         console.log(enemyBadgeList);
    //         // Assert
    //         const expectedShieldDamage = 78;
    //         const expectedHealthDamage = 87;
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

    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, shieldDamage: 19 });
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, shieldDamage: 20 });
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, shieldDamage: 21 }); // 60
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, healthDamage: 22 });
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, healthDamage: 23 });
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, healthDamage: 24 }); // 69
    //     tick(1000);
    //     tick(10000); // 0, 0

    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, shieldDamage: 25 });
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, shieldDamage: 26 });
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, shieldDamage: 27 }); // 78
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, healthDamage: 28 });
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, healthDamage: 29 });
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, healthDamage: 30 }); // 87
    //     tick(1000);

    //     discardPeriodicTasks();
    //     expect(subscribeCalled).toBeTrue();
    // }));

    // it("resets damage aggregate sum to many enemies after a timeout period, and re-aggregates damage again", fakeAsync(() => {
    //     // Arrange
    //     let subscribeCalled = false;
    //     const victim = { name: "ShieldANDHealthDamage" };
    //     const startEvent: MatchStateChangedEvent = {
    //         startDate: new Date("2020-01-01T00:00:00"),
    //         state: MatchState.Active,
    //     };
    //     jasmine.clock().mockDate(startEvent.startDate);

    //     let count = 0;
    //     sut.enemyBadgeList$.pipe().subscribe((enemyBadgeList) => {
    //         count++;
    //         console.log(count);
    //         console.log(enemyBadgeList);
    //         // Assert
    //         const expectedShieldDamage = 78;
    //         const expectedHealthDamage = 87;
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

    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, shieldDamage: 19 });
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, shieldDamage: 20 });
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, shieldDamage: 21 }); // 60
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, healthDamage: 22 });
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, healthDamage: 23 });
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, healthDamage: 24 }); // 69
    //     tick(10000);

    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, shieldDamage: 25 });
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, shieldDamage: 26 });
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, shieldDamage: 27 }); // 78
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, healthDamage: 28 });
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, healthDamage: 29 });
    //     tick(1000);
    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent({ victim, healthDamage: 30 }); // 87
    //     tick(1000);

    //     discardPeriodicTasks();
    //     expect(subscribeCalled).toBeTrue();
    // }));

    // it("shows enemy teammates after a damage event", () => {
    //     // Arrange
    //     const startEvent: MatchStateChangedEvent = {
    //         startDate: new Date("2020-01-01T00:00:00"),
    //         state: MatchState.Active,
    //     };
    //     jasmine.clock().mockDate(startEvent.startDate);

    //     // Act
    //     matchService.startedEvent$.next(startEvent);
    //     matchService.state$.next(startEvent);
    //     matchPlayerService.myState$.next(PlayerState.Alive);
    //     matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

    //     // Assert
    //     let damageEventList = sut.enemyBadgeList$.value;
    //     expect(damageEventList.length).toBe(0);

    //     (matchPlayerInflictionService as MockMatchPlayerInflictionService).mockDamageEvent();
    //     // Assert
    //     damageEventList = sut.enemyBadgeList$.value;
    //     expect(damageEventList.length).toBe(1);
    // });

    // it("shows many enemies after a damage event", () => {});

    // it("shows the teammates of a damaged enemy", () => {});
});
