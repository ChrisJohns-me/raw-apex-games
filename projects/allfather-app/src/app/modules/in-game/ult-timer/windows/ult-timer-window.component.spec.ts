import { ConfigurationService } from "@allfather-app/app/modules/core/configuration.service";
import { MatchPlayerLegendService } from "@allfather-app/app/modules/core/match/match-player-legend.service";
import { MatchPlayerLocationService } from "@allfather-app/app/modules/core/match/match-player-location.service";
import { MatchPlayerService } from "@allfather-app/app/modules/core/match/match-player.service";
import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { MockUIContainerComponent } from "@allfather-app/app/modules/core/mocks/components/mock-ui-container.component";
import { MockConfigurationService } from "@allfather-app/app/modules/core/mocks/services/mock-configuration.service";
import { MockMatchPlayerLegendService } from "@allfather-app/app/modules/core/mocks/services/mock-match-player-legend.service";
import { MockMatchPlayerLocationService } from "@allfather-app/app/modules/core/mocks/services/mock-match-player-location.service";
import { MockMatchPlayerService } from "@allfather-app/app/modules/core/mocks/services/mock-match-player.service";
import { MockMatchService } from "@allfather-app/app/modules/core/mocks/services/mock-match.service";
import { MatchLocationPhase } from "@allfather-app/app/shared/models/match/location";
import { MatchState } from "@allfather-app/app/shared/models/match/state";
import { PlayerState } from "@allfather-app/app/shared/models/player-state";
import { CustomFormatDistanceToNowPipe } from "@allfather-app/app/shared/pipes/custom-format-distance-to-now.pipe";
import { ChangeDetectorRef } from "@angular/core";
import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { differenceInMilliseconds } from "date-fns";
import { of } from "rxjs";
import { filter, mapTo, take, tap } from "rxjs/operators";
import { TestScheduler } from "rxjs/testing";
import * as seedrandom from "seedrandom";
import { UltTimerWindowComponent } from "./ult-timer-window.component";

const percentsArr = [...Array(21).keys()].map((n) => n * 0.05); // 0 to 1 in 0.05 increments

describe("UltTimerWindowComponent", () => {
    let sut: UltTimerWindowComponent;
    let fixture: ComponentFixture<UltTimerWindowComponent>;
    let scheduler: TestScheduler;
    let matchService: MatchService;
    let matchPlayerService: MatchPlayerService;
    let matchPlayerLegendService: MatchPlayerLegendService;
    let matchPlayerLocationService: MatchPlayerLocationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UltTimerWindowComponent, MockUIContainerComponent, CustomFormatDistanceToNowPipe],
            providers: [
                { provide: ChangeDetectorRef, useValue: {} },
                { provide: ConfigurationService, useClass: MockConfigurationService },
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
        fixture = TestBed.createComponent(UltTimerWindowComponent);
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

    it("should return starting date at undefined", fakeAsync(() => {
        const actual = sut.maybeReadyDate;
        expect(actual).toBeUndefined();
    }));

    it("should show when player has landed", fakeAsync(() => {
        // Arrange / Act
        matchService.state$.next({ state: MatchState.Active, startDate: new Date(), matchId: "test" });
        matchService.startedEvent$.next(matchService.state$.value);
        matchPlayerService.myState$.next(PlayerState.Alive);
        matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

        const actual = sut.isVisible;
        // Assert
        expect(actual).toBeTrue();
    }));

    it("should hide when player is knocked", fakeAsync(() => {
        // Arrange
        matchService.state$.next({ state: MatchState.Active, startDate: new Date(), matchId: "test" });
        matchService.startedEvent$.next(matchService.state$.value);
        matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

        // Act
        matchPlayerService.myState$.next(PlayerState.Knocked);

        const actual = sut.isVisible;
        // Assert
        expect(actual).toBeFalse();
    }));

    it("should hide when player is eliminated", fakeAsync(() => {
        // Arrange
        matchService.state$.next({ state: MatchState.Active, startDate: new Date(), matchId: "test" });
        matchService.startedEvent$.next(matchService.state$.value);
        matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

        // Act
        matchPlayerService.myState$.next(PlayerState.Eliminated);

        const actual = sut.isVisible;
        // Assert
        expect(actual).toBeFalse();
    }));

    it("should hide when player is disconnected", fakeAsync(() => {
        // Arrange
        matchService.state$.next({ state: MatchState.Active, startDate: new Date(), matchId: "test" });
        matchService.startedEvent$.next(matchService.state$.value);
        matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

        // Act
        matchPlayerService.myState$.next(PlayerState.Disconnected);

        const actual = sut.isVisible;
        // Assert
        expect(actual).toBeFalse();
    }));

    it("should hide when match is inactive", fakeAsync(() => {
        // Arrange
        matchService.state$.next({ state: MatchState.Inactive, startDate: new Date(), matchId: "test" });
        matchService.startedEvent$.next(matchService.state$.value);
        matchPlayerService.myState$.next(PlayerState.Alive);
        matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

        // Act
        matchService.state$.next({ state: MatchState.Inactive, startDate: new Date(), endDate: new Date(), matchId: "test" });
        matchService.endedEvent$.next(matchService.state$.value);

        const actual = sut.isVisible;
        expect(actual).toBeFalse();
        // Assert
        discardPeriodicTasks();
    }));

    it("should have a property that returns true when the ultimate is ready", fakeAsync(() => {
        // Arrange
        jasmine.clock().mockDate(new Date("2020-01-01T00:00:00"));
        matchService.state$.next({ state: MatchState.Active, startDate: new Date(), matchId: "test" });
        matchService.startedEvent$.next(matchService.state$.value);
        matchPlayerService.myState$.next(PlayerState.Alive);
        matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

        // Act
        of(...percentsArr)
            .pipe(tap(() => tick(10000)))
            .subscribe(matchPlayerLegendService.myUltimateCooldown$);

        const actual = sut.isUltimateReady;
        expect(actual).toBeTrue();
        // Assert
        discardPeriodicTasks();
    }));

    it("should have a property that returns false when the ultimate is NOT ready", fakeAsync(() => {
        // Arrange
        jasmine.clock().mockDate(new Date("2020-01-01T00:00:00"));
        matchService.state$.next({ state: MatchState.Active, startDate: new Date(), matchId: "test" });
        matchService.startedEvent$.next(matchService.state$.value);
        matchPlayerService.myState$.next(PlayerState.Alive);
        matchPlayerLocationService.myLocationPhase$.next(MatchLocationPhase.HasLanded);

        // Act
        of(...percentsArr)
            .pipe(
                mapTo(0.5),
                take(1),
                tap(() => tick(10000))
            )
            .subscribe(matchPlayerLegendService.myUltimateCooldown$);

        const actual = sut.isUltimateReady;
        // Assert
        expect(actual).toBeFalse();
        discardPeriodicTasks();
    }));

    it("should calculate time remaining accurately", fakeAsync(() => {
        // Arrange
        jasmine.clock().mockDate(new Date("2020-01-01T00:00:00"));
        matchService.state$.next({ state: MatchState.Active, startDate: new Date(), matchId: "test" });
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

                    const actualReadyDate = sut.maybeReadyDate;
                    const actualRemaining = differenceInMilliseconds(actualReadyDate!, new Date());
                    expect(actualRemaining).toBeCloseTo(expectedTimeRemainingMs, -4, `Failed on percent: ${currPercent}`);
                })
            )
            .subscribe();

        discardPeriodicTasks();
    }));

    it("should calculate time remaining with variance (approximately wihin 10 seconds)", fakeAsync(() => {
        // Arrange
        jasmine.clock().mockDate(new Date("2020-01-01T00:00:00"));
        matchService.state$.next({ state: MatchState.Active, startDate: new Date(), matchId: "test" });
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

                    const actualReadyDate = sut.maybeReadyDate;
                    const actualRemaining = differenceInMilliseconds(actualReadyDate!, new Date());
                    expect(actualRemaining).toBeCloseTo(expectedTimeRemainingMs, -5, `Failed on percent: ${currPercent}`);
                })
            )
            .subscribe();

        discardPeriodicTasks();
    }));
});
