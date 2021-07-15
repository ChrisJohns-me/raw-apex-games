import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { MockMatchService } from "@allfather-app/app/modules/core/mocks/mock-match.service";
import { ChangeDetectorRef } from "@angular/core";
import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { MatchState, MatchStateChangedEvent } from "@shared-app/match/state";
import { MockUIContainerComponent } from "@shared-app/mocks/components/mock-ui-container.component";
import { addMilliseconds } from "date-fns";
import { TestScheduler } from "rxjs/testing";
import { MatchTimerWindowComponent } from "./match-timer-window.component";

describe("MatchTimerWindowComponent", () => {
    let sut: MatchTimerWindowComponent;
    let fixture: ComponentFixture<MatchTimerWindowComponent>;
    let scheduler: TestScheduler;
    let matchService: MatchService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MatchTimerWindowComponent, MockUIContainerComponent],
            providers: [
                { provide: ChangeDetectorRef, useValue: {} },
                { provide: MatchService, useClass: MockMatchService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        scheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
        scheduler.maxFrames = 5000;
        fixture = TestBed.createComponent(MatchTimerWindowComponent);
        sut = fixture.componentInstance;
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
        const actual = sut.showTimer;
        expect(actual).toBeFalse();
    });

    it("should show when match is active", fakeAsync(() => {
        // Arrange
        const startEvent: MatchStateChangedEvent = {
            startDate: new Date("2020-01-01T00:00:00"),
            state: MatchState.Active,
            matchId: "test",
        };

        // Act
        matchService.startedEvent$.next(startEvent);
        matchService.state$.next(startEvent);

        const actual = sut.showTimer;
        // Assert
        expect(actual).toBeTrue();
        discardPeriodicTasks();
    }));

    it("should hide when match is inactive", fakeAsync(() => {
        // Arrange
        const startEvent: MatchStateChangedEvent = {
            startDate: new Date("2020-01-01T00:00:00"),
            state: MatchState.Active,
            matchId: "test",
        };
        const endEvent: MatchStateChangedEvent = {
            startDate: startEvent.startDate,
            endDate: new Date("2020-01-01T00:30:00"),
            state: MatchState.Inactive,
            matchId: "test",
        };

        // Act
        matchService.startedEvent$.next(startEvent);
        matchService.state$.next(startEvent);

        matchService.endedEvent$.next(endEvent);
        matchService.state$.next(endEvent);
        tick(60 * 1000); // There may be a delay between match end and hiding the timer

        // Assert
        const actual = sut.showTimer;
        expect(actual).toBeFalse();
        discardPeriodicTasks();
    }));

    it("should update the correct match duration", fakeAsync(() => {
        // Arrange
        const startDate = new Date("2020-01-01T00:00:00");
        jasmine.clock().mockDate(startDate);
        const startEvent: MatchStateChangedEvent = {
            startDate: startDate,
            state: MatchState.Active,
            matchId: "test",
        };
        const midDates = [60000, 120000, 180000, 300000, 600000, 1200000];
        matchService.startedEvent$.next(startEvent);
        matchService.state$.next(startEvent);

        // Act
        for (let i = 0; i < midDates.length; i++) {
            const prev = midDates[i - 1] ?? 0;
            const curr = midDates[i];
            const diff = curr - prev;
            tick(diff);
            // Assert
            expect(sut.matchDurationDate.getTime()).toBeCloseTo(curr, -3);
        }

        discardPeriodicTasks();
    }));

    it("should show the correct end match duration", fakeAsync(() => {
        // Arrange
        const expectedDuration = 10 * 60 * 1000;
        const startDate = new Date("2020-01-01T00:00:00");
        const endDate = addMilliseconds(startDate, expectedDuration);
        const startEvent: MatchStateChangedEvent = {
            startDate: startDate,
            state: MatchState.Active,
            matchId: "test",
        };
        const endEvent: MatchStateChangedEvent = {
            startDate: startDate,
            endDate: endDate,
            state: MatchState.Inactive,
            matchId: "test",
        };

        // Act
        matchService.startedEvent$.next(startEvent);
        matchService.state$.next(startEvent);
        tick(expectedDuration);

        matchService.endedEvent$.next(endEvent);
        matchService.state$.next(endEvent);

        // Assert
        expect(sut.matchDurationDate.getTime()).toBeCloseTo(endDate.getTime() - startDate.getTime(), 0);
        discardPeriodicTasks();
    }));
});
