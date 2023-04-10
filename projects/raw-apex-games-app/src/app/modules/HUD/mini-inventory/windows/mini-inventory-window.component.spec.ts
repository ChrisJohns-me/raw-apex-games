import { ChangeDetectorRef } from "@angular/core";
import { ComponentFixture, TestBed, discardPeriodicTasks, fakeAsync, tick } from "@angular/core/testing";
import { MatchLocationPhase } from "@raw-apex-games-app/app/common/match/location";
import { MatchState, MatchStateChangedEvent } from "@raw-apex-games-app/app/common/match/state";
import { PlayerState } from "@raw-apex-games-app/app/common/player-state";
import { supressConsoleLog } from "@raw-apex-games-app/app/common/testing-helpers";
import { MatchPlayerInventoryService } from "@raw-apex-games-app/app/modules/core/match/match-player-inventory.service";
import { MatchPlayerLocationService } from "@raw-apex-games-app/app/modules/core/match/match-player-location.service";
import { MatchPlayerStatsService } from "@raw-apex-games-app/app/modules/core/match/match-player-stats.service";
import { MatchPlayerService } from "@raw-apex-games-app/app/modules/core/match/match-player.service";
import { MatchService } from "@raw-apex-games-app/app/modules/core/match/match.service";
import { MockUIContainerComponent } from "@raw-apex-games-app/app/modules/core/mocks/components/mock-ui-container.component";
import { MockMatchPlayerInventoryService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-match-player-inventory.service";
import { MockMatchPlayerLocationService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-match-player-location.service";
import { MockMatchPlayerStatsService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-match-player-stats.service";
import { MockMatchPlayerService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-match-player.service";
import { MockMatchService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-match.service";
import { TestScheduler } from "rxjs/testing";
import { MiniInventoryWindowComponent } from "./mini-inventory-window.component";

describe("MiniInventoryWindowComponent", () => {
    let sut: MiniInventoryWindowComponent;
    let fixture: ComponentFixture<MiniInventoryWindowComponent>;
    let scheduler: TestScheduler;
    let matchPlayerLocationService: MatchPlayerLocationService;
    let matchPlayerService: MatchPlayerService;
    let matchPlayerStatsService: MatchPlayerStatsService;
    let matchService: MatchService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MiniInventoryWindowComponent, MockUIContainerComponent],
            providers: [
                { provide: ChangeDetectorRef, useValue: {} },
                { provide: MatchService, useClass: MockMatchService },
                { provide: MatchPlayerService, useClass: MockMatchPlayerService },
                { provide: MatchPlayerInventoryService, useClass: MockMatchPlayerInventoryService },
                { provide: MatchPlayerLocationService, useClass: MockMatchPlayerLocationService },
                { provide: MatchPlayerStatsService, useClass: MockMatchPlayerStatsService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        scheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
        supressConsoleLog();
        scheduler.maxFrames = 5000;
        fixture = TestBed.createComponent(MiniInventoryWindowComponent);
        sut = fixture.componentInstance;
        matchPlayerLocationService = TestBed.inject(MatchPlayerLocationService);
        matchPlayerService = TestBed.inject(MatchPlayerService);
        matchPlayerStatsService = TestBed.inject(MatchPlayerStatsService);
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
});
