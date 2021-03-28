import { ChangeDetectorRef } from "@angular/core";
import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { MatchLocationPhase } from "@common/match/match-location";
import { MatchState } from "@common/match/match-state";
import { PlayerState } from "@common/player-state";
import { MatchPlayerLegendService } from "@core/match/match-player-legend.service";
import { MatchPlayerLocationService } from "@core/match/match-player-location.service";
import { MatchPlayerService } from "@core/match/match-player.service";
import { MatchService } from "@core/match/match.service";
import { of } from "rxjs";
import { filter, mapTo, take, tap } from "rxjs/operators";
import { TestScheduler } from "rxjs/testing";
import * as seedrandom from "seedrandom";
import { MockMatchPlayerLegendService } from "src/app/mocks/mock-match-player-legend.service";
import { MockMatchPlayerLocationService } from "src/app/mocks/mock-match-player-location.service";
import { MockMatchPlayerService } from "src/app/mocks/mock-match-player.service";
import { MockMatchService } from "src/app/mocks/mock-match.service";
import { MockUIContainerComponent } from "src/app/mocks/mock-ui-container.component";
import { InGameUltTimerWindowComponent } from "./in-game-ult-timer-window.component";

const percentsArr = [...Array(21).keys()].map((n) => n * 0.05); // 0 to 1 in 0.05 increments

describe("InGameUltTimerWindowComponent", () => {
    let sut: InGameUltTimerWindowComponent;
    let fixture: ComponentFixture<InGameUltTimerWindowComponent>;
    let scheduler: TestScheduler;
    let matchService: MockMatchService;
    let matchPlayerService: MockMatchPlayerService;
    let matchPlayerLegendService: MockMatchPlayerLegendService;
    let matchPlayerLocationService: MockMatchPlayerLocationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InGameUltTimerWindowComponent, MockUIContainerComponent],
            providers: [
                { provide: ChangeDetectorRef, useValue: {} },
                { provide: MatchService, useClass: MockMatchService },
                { provide: MatchPlayerService, useClass: MockMatchPlayerService },
                { provide: MatchPlayerLegendService, useClass: MockMatchPlayerLegendService },
                { provide: MatchPlayerLocationService, useClass: MockMatchPlayerLocationService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        scheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
        scheduler.maxFrames = 5000;
        fixture = TestBed.createComponent(InGameUltTimerWindowComponent);
        sut = fixture.componentInstance;
        matchService = TestBed.inject(MatchService);
        matchPlayerService = TestBed.inject(MatchPlayerService);
        matchPlayerLegendService = TestBed.inject(MatchPlayerLegendService);
        matchPlayerLocationService = TestBed.inject(MatchPlayerLocationService);
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

    it("should return starting date at zero", fakeAsync(() => {
        const actual = sut.ultimateReadyRemaining;
        expect(actual.getTime()).toBeLessThanOrEqual(new Date(1).getTime());
    }));

    it("should show when player has landed", fakeAsync(() => {
        matchService.state$.next({ state: MatchState.Active, startDate: new Date() });
        matchService.startedEvent$.next(matchService.state$.value);
        matchPlayerService.myState$.next(PlayerState.Alive);
        matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

        const actual = sut.isVisible;
        expect(actual).toBeTrue();
    }));

    it("should hide when player is knocked", fakeAsync(() => {
        matchService.state$.next({ state: MatchState.Active, startDate: new Date() });
        matchService.startedEvent$.next(matchService.state$.value);
        matchPlayerService.myState$.next(PlayerState.Knocked);
        matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

        const actual = sut.isVisible;
        expect(actual).toBeFalse();
    }));

    it("should hide when player is eliminated", fakeAsync(() => {
        matchService.state$.next({ state: MatchState.Active, startDate: new Date() });
        matchService.startedEvent$.next(matchService.state$.value);
        matchPlayerService.myState$.next(PlayerState.Eliminated);
        matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

        const actual = sut.isVisible;
        expect(actual).toBeFalse();
    }));

    it("should hide when match is inactive", fakeAsync(() => {
        matchService.state$.next({ state: MatchState.Inactive, startDate: new Date() });
        matchService.startedEvent$.next(matchService.state$.value);
        matchPlayerService.myState$.next(PlayerState.Alive);
        matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

        matchService.state$.next({ state: MatchState.Inactive, startDate: new Date(), endDate: new Date() });
        matchService.endedEvent$.next(matchService.state$.value);

        const actual = sut.isVisible;
        expect(actual).toBeFalse();
        discardPeriodicTasks();
    }));

    it("should have a property that returns true when the ultimate is ready", fakeAsync(() => {
        jasmine.clock().mockDate(new Date("2020-01-01T00:00:00"));
        matchService.state$.next({ state: MatchState.Active, startDate: new Date() });
        matchService.startedEvent$.next(matchService.state$.value);
        matchPlayerService.myState$.next(PlayerState.Alive);
        matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

        of(...percentsArr)
            .pipe(tap(() => tick(10000)))
            .subscribe(matchPlayerLegendService.myUltimateCooldown$);

        const actual = sut.isUltimateReady;
        expect(actual).toBeTrue();
        discardPeriodicTasks();
    }));

    it("should have a property that returns false when the ultimate is NOT ready", fakeAsync(() => {
        jasmine.clock().mockDate(new Date("2020-01-01T00:00:00"));
        matchService.state$.next({ state: MatchState.Active, startDate: new Date() });
        matchService.startedEvent$.next(matchService.state$.value);
        matchPlayerService.myState$.next(PlayerState.Alive);
        matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

        of(...percentsArr)
            .pipe(
                mapTo(0.5),
                take(1),
                tap(() => tick(10000))
            )
            .subscribe(matchPlayerLegendService.myUltimateCooldown$);

        const actual = sut.isUltimateReady;
        expect(actual).toBeFalse();
        discardPeriodicTasks();
    }));

    it("should calculate time remaining accurately", fakeAsync(() => {
        // Arrange
        jasmine.clock().mockDate(new Date("2020-01-01T00:00:00"));
        matchService.state$.next({ state: MatchState.Active, startDate: new Date() });
        matchService.startedEvent$.next(matchService.state$.value);
        matchPlayerService.myState$.next(PlayerState.Alive);
        matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

        const updateDelayMs = 10000;
        const totalTimeMs = updateDelayMs * (percentsArr.length - 1);

        of(...percentsArr)
            .pipe(
                // Act
                filter((currPercent) => currPercent > 0 && currPercent < 1),
                tap((currPercent) => {
                    tick(updateDelayMs);
                    matchPlayerLegendService.myUltimateCooldown$.next(currPercent);
                }),
                // Assert
                tap((currPercent) => {
                    const percentRemaining = 1 - currPercent;
                    const expectedTimeRemainingMs = percentRemaining * totalTimeMs;

                    const actual = sut.ultimateReadyRemaining;
                    expect(actual.getTime()).toBeCloseTo(expectedTimeRemainingMs, -4, `Failed on percent: ${currPercent}`);
                })
            )
            .subscribe();

        discardPeriodicTasks();
    }));

    fit("should calculate time remaining with variance (approximately wihin 10 seconds)", fakeAsync(() => {
        // Arrange
        jasmine.clock().mockDate(new Date("2020-01-01T00:00:00"));
        matchService.state$.next({ state: MatchState.Active, startDate: new Date() });
        matchService.startedEvent$.next(matchService.state$.value);
        matchPlayerService.myState$.next(PlayerState.Alive);
        matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

        const varianceGen = (input: number): number => {
            const seed = input.toString();
            const baseMs = 5000;
            const variance = baseMs * 2 * (seedrandom(seed)() - 0.5);
            return variance;
        };

        const updateDelayMs = 10000;
        const totalTimeMs = updateDelayMs * (percentsArr.length - 1);

        of(...percentsArr)
            .pipe(
                // Act
                filter((currPercent) => currPercent > 0 && currPercent < 1),
                tap((currPercent) => {
                    const variance = varianceGen(currPercent);
                    tick(updateDelayMs + variance);
                    matchPlayerLegendService.myUltimateCooldown$.next(currPercent);
                }),
                // Assert
                tap((currPercent) => {
                    const percentRemaining = 1 - currPercent;
                    const expectedTimeRemainingMs = percentRemaining * totalTimeMs;

                    const actual = sut.ultimateReadyRemaining;
                    expect(actual.getTime()).toBeCloseTo(expectedTimeRemainingMs, -5, `Failed on percent: ${currPercent}`);
                })
            )
            .subscribe();

        discardPeriodicTasks();
    }));
});
