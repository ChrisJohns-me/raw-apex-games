import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { MockMatchRosterService } from "@core/mocks/services/mock-match-roster.service";
import { MockMatchService } from "@core/mocks/services/mock-match.service";
import { MockOverwolfDataProviderService } from "@core/mocks/services/mock-overwolf-data-provider.service";
import { MockPlayerService } from "@core/mocks/services/mock-player.service";
import { OverwolfDataProviderService } from "@core/overwolf-data-provider";
import { PlayerService } from "@core/player.service";
import { MatchInflictionEvent } from "@shared/models/match/match-infliction-event";
import { MatchRoster } from "@shared/models/match/match-roster";
import { MatchRosterPlayer } from "@shared/models/match/match-roster-player";
import { MatchState } from "@shared/models/match/match-state";
import { PlayerState } from "@shared/models/player-state";
import { TestScheduler } from "rxjs/testing";
import { MatchActivityService } from "./match-activity.service";
import { MatchRosterService } from "./match-roster.service";
import { MatchService } from "./match.service";

describe("MatchActivityService", () => {
    let sut: MatchActivityService;
    let scheduler: TestScheduler;
    let matchService: MatchService;
    let matchRosterService: MatchRosterService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                MatchActivityService,
                { provide: MatchRosterService, useClass: MockMatchRosterService },
                { provide: MatchService, useClass: MockMatchService },
                { provide: OverwolfDataProviderService, useClass: MockOverwolfDataProviderService },
                { provide: PlayerService, useClass: MockPlayerService },
            ],
        });
    });

    beforeEach(() => {
        jasmine.clock().uninstall();
        jasmine.clock().install();
        sut = TestBed.inject(MatchActivityService);
        matchService = TestBed.inject(MatchService);
        matchRosterService = TestBed.inject(MatchRosterService);
    });

    describe("playerLastKnownState", () => {
        it("returns undefined if player name is empty", fakeAsync(() => {
            // Arrange
            jasmine.clock().mockDate(new Date(0));
            const matchRoster = new MatchRoster();
            matchRosterService.matchRoster$.next(matchRoster);
            const actualPlayer: MatchRosterPlayer = { name: "" };
            tick(5000);
            const matchStartDate = new Date();
            matchService.startedEvent$.next({ startDate: matchStartDate, state: MatchState.Active });
            matchService.state$.next({ startDate: matchStartDate, state: MatchState.Active });

            // Act
            const actual = sut.playerLastKnownState(actualPlayer);

            // Assert
            expect(actual).toBe(undefined);
        }));

        it("returns undefined if match roster is empty", fakeAsync(() => {
            // Arrange
            jasmine.clock().mockDate(new Date(0));
            const matchRoster = new MatchRoster();
            matchRosterService.matchRoster$.next(matchRoster);
            const actualPlayer: MatchRosterPlayer = { name: "NonExistantPlayer", teamId: 0 };
            tick(5000);
            const matchStartDate = new Date();
            matchService.startedEvent$.next({ startDate: matchStartDate, state: MatchState.Active });
            matchService.state$.next({ startDate: matchStartDate, state: MatchState.Active });

            // Act
            const actual = sut.playerLastKnownState(actualPlayer);

            // Assert
            expect(actual).toBe(undefined);
        }));

        it("returns state and timestamp of alive player", fakeAsync(() => {
            // Arrange
            jasmine.clock().mockDate(new Date(0));
            const matchRoster = new MatchRoster();
            const actualPlayer: MatchRosterPlayer = { name: "Alive Player", teamId: 0 };
            matchRoster.addPlayer({ name: "Player1", teamId: 0 });
            matchRoster.addPlayer({ name: "Player2", teamId: 0 });
            matchRoster.addPlayer({ name: "Player3", teamId: 0 });
            matchRoster.addPlayer(actualPlayer);
            tick(5000);
            const matchStartDate = new Date();
            matchService.startedEvent$.next({ startDate: matchStartDate, state: MatchState.Active });
            matchService.state$.next({ startDate: matchStartDate, state: MatchState.Active });
            matchRosterService.matchRoster$.next(matchRoster);
            tick(10000);

            // Act
            const actual = sut.playerLastKnownState(actualPlayer);

            // Assert
            const expected: { timestamp: Date; state: PlayerState } = {
                timestamp: matchStartDate,
                state: PlayerState.Alive,
            };
            expect(actual).toEqual(expected);
        }));

        it("returns state and timestamp of assumed alive player (from knockdown)", fakeAsync(() => {
            // Arrange
            jasmine.clock().mockDate(new Date(0));
            const matchRoster = new MatchRoster();
            const actualPlayer: MatchRosterPlayer = { name: "Alive Player", teamId: 0 };
            matchRoster.addPlayer({ name: "Player1", teamId: 0 });
            matchRoster.addPlayer({ name: "Player2", teamId: 0 });
            matchRoster.addPlayer({ name: "Player3", teamId: 0 });
            matchRoster.addPlayer(actualPlayer);
            tick(5000);
            const matchStartDate = new Date();
            matchService.startedEvent$.next({ startDate: matchStartDate, state: MatchState.Active });
            matchService.state$.next({ startDate: matchStartDate, state: MatchState.Active });
            matchRosterService.matchRoster$.next(matchRoster);
            tick(10000);
            // Player gets knocked down
            const knockdownDate = new Date();
            const knockdownEvent: MatchInflictionEvent = {
                timestamp: knockdownDate,
                victim: actualPlayer,
                attacker: { name: "Someone" },
                isKnockdown: true,
                isElimination: false,
            };
            sut.killfeedEvent$.next(knockdownEvent);
            sut.killfeedEventHistory$.next([...sut.killfeedEventHistory$.value, knockdownEvent]);
            tick(60000);
            // But he gets up again...
            const aliveDate = new Date();
            const aliveEvent: MatchInflictionEvent = {
                timestamp: aliveDate,
                victim: { name: "Someone Else" },
                attacker: actualPlayer,
                isKnockdown: true,
                isElimination: false,
            };
            sut.killfeedEvent$.next(aliveEvent);
            sut.killfeedEventHistory$.next([...sut.killfeedEventHistory$.value, aliveEvent]);

            // Act
            const actual = sut.playerLastKnownState(actualPlayer);

            // Assert
            const expected: { timestamp: Date; state: PlayerState } = {
                timestamp: aliveDate,
                state: PlayerState.Alive,
            };
            expect(actual).toEqual(expected);
        }));

        it("returns state and timestamp of assumed alive player (from elimination)", fakeAsync(() => {
            // Arrange
            jasmine.clock().mockDate(new Date(0));
            const matchRoster = new MatchRoster();
            const actualPlayer: MatchRosterPlayer = { name: "Alive Player", teamId: 0 };
            matchRoster.addPlayer({ name: "Player1", teamId: 0 });
            matchRoster.addPlayer({ name: "Player2", teamId: 0 });
            matchRoster.addPlayer({ name: "Player3", teamId: 0 });
            matchRoster.addPlayer(actualPlayer);
            tick(5000);
            const matchStartDate = new Date();
            matchService.startedEvent$.next({ startDate: matchStartDate, state: MatchState.Active });
            matchService.state$.next({ startDate: matchStartDate, state: MatchState.Active });
            matchRosterService.matchRoster$.next(matchRoster);
            tick(10000);
            // Player gets eliminated
            const eliminationDate = new Date();
            const eliminationEvent: MatchInflictionEvent = {
                timestamp: eliminationDate,
                victim: actualPlayer,
                attacker: { name: "Someone" },
                isKnockdown: false,
                isElimination: true,
            };
            sut.killfeedEvent$.next(eliminationEvent);
            sut.killfeedEventHistory$.next([...sut.killfeedEventHistory$.value, eliminationEvent]);
            tick(60000);
            // But he gets respawned...
            const aliveDate = new Date();
            const aliveEvent: MatchInflictionEvent = {
                timestamp: aliveDate,
                victim: { name: "Someone Else" },
                attacker: actualPlayer,
                isKnockdown: true,
                isElimination: false,
            };
            sut.killfeedEvent$.next(aliveEvent);
            sut.killfeedEventHistory$.next([...sut.killfeedEventHistory$.value, aliveEvent]);

            // Act
            const actual = sut.playerLastKnownState(actualPlayer);

            // Assert
            const expected: { timestamp: Date; state: PlayerState } = {
                timestamp: aliveDate,
                state: PlayerState.Alive,
            };
            expect(actual).toEqual(expected);
        }));

        it("returns state and timestamp of knocked player", fakeAsync(() => {
            // Arrange
            jasmine.clock().mockDate(new Date(0));
            const matchRoster = new MatchRoster();
            const actualPlayer: MatchRosterPlayer = { name: "Alive Player", teamId: 0 };
            matchRoster.addPlayer({ name: "Player1", teamId: 0 });
            matchRoster.addPlayer({ name: "Player2", teamId: 0 });
            matchRoster.addPlayer({ name: "Player3", teamId: 0 });
            matchRoster.addPlayer(actualPlayer);
            tick(5000);
            const matchStartDate = new Date();
            matchRosterService.matchRoster$.next(matchRoster);
            matchService.startedEvent$.next({ startDate: matchStartDate, state: MatchState.Active });
            matchService.state$.next({ startDate: matchStartDate, state: MatchState.Active });
            tick(10000);
            const knockdownDate = new Date();
            const knockdownEvent: MatchInflictionEvent = {
                timestamp: knockdownDate,
                victim: actualPlayer,
                attacker: { name: "Someone" },
                isKnockdown: true,
                isElimination: false,
            };
            sut.killfeedEvent$.next(knockdownEvent);
            sut.killfeedEventHistory$.next([...sut.killfeedEventHistory$.value, knockdownEvent]);

            // Act
            const actual = sut.playerLastKnownState(actualPlayer);

            // Assert
            const expected: { timestamp: Date; state: PlayerState } = {
                timestamp: knockdownDate,
                state: PlayerState.Knocked,
            };
            expect(actual).toEqual(expected);
        }));

        it("returns state and timestamp of eliminated player", fakeAsync(() => {
            // Arrange
            jasmine.clock().mockDate(new Date(0));
            const matchRoster = new MatchRoster();
            const actualPlayer: MatchRosterPlayer = { name: "Alive Player", teamId: 0 };
            matchRoster.addPlayer({ name: "Player1", teamId: 0 });
            matchRoster.addPlayer({ name: "Player2", teamId: 0 });
            matchRoster.addPlayer({ name: "Player3", teamId: 0 });
            matchRoster.addPlayer(actualPlayer);
            tick(5000);
            const matchStartDate = new Date();
            matchRosterService.matchRoster$.next(matchRoster);
            matchService.startedEvent$.next({ startDate: matchStartDate, state: MatchState.Active });
            matchService.state$.next({ startDate: matchStartDate, state: MatchState.Active });
            tick(10000);
            const eliminationDate = new Date();
            const eliminationEvent: MatchInflictionEvent = {
                timestamp: eliminationDate,
                victim: actualPlayer,
                attacker: { name: "Someone" },
                isKnockdown: false,
                isElimination: true,
            };
            sut.killfeedEvent$.next(eliminationEvent);
            sut.killfeedEventHistory$.next([...sut.killfeedEventHistory$.value, eliminationEvent]);

            // Act
            const actual = sut.playerLastKnownState(actualPlayer);

            // Assert
            const expected: { timestamp: Date; state: PlayerState } = {
                timestamp: eliminationDate,
                state: PlayerState.Eliminated,
            };
            expect(actual).toEqual(expected);
        }));
    });
});
