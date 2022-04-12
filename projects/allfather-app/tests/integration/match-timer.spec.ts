// import { LocalDatabaseService } from "@allfather-app/app/modules/core/local-database/local-database.service";
// import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
// import { MockUIContainerComponent } from "@allfather-app/app/modules/core/mocks/components/mock-ui-container.component";
// import { MockOverwolfAPI } from "@allfather-app/app/modules/core/mocks/mock-overwolf-api";
// import { OverwolfGameDataService } from "@allfather-app/app/modules/core/overwolf";
// import { OverwolfConfig, OW_CONFIG } from "@allfather-app/app/modules/core/overwolf/overwolf-config";
// import {
//     OverwolfFeatureRegistrationService,
//     OWFeatureRegistrationStatus,
// } from "@allfather-app/app/modules/core/overwolf/overwolf-feature-registration.service";
// import { MatchTimerWindowComponent } from "@allfather-app/app/modules/HUD/match-timer/windows/match-timer-window.component";
// import { ChangeDetectorRef } from "@angular/core";
// import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, flushMicrotasks, TestBed, tick } from "@angular/core/testing";
// import { differenceInMilliseconds } from "date-fns";
// import { filter } from "rxjs/operators";
// import { TestScheduler } from "rxjs/testing";
// import { GameScenario } from "../game-scenario";
// import { GameScenarioBuilder } from "../game-scenario-builder";

// /**
//  * Integration test
//  * - Overwolf Game Data Service
//  * - Match Service
//  * - Match Timer Window
//  */
// describe("Match Timer Integration", () => {
//     const gameScenarioBuilder = new GameScenarioBuilder();
//     let mockUIContainer: MockUIContainerComponent;
//     let mockOverwolfAPI: MockOverwolfAPI;
//     let sut: MatchTimerWindowComponent;
//     let fixture: ComponentFixture<MatchTimerWindowComponent>;
//     let scheduler: TestScheduler;
//     let matchService: MatchService;
//     let overwolfGameDataService: OverwolfGameDataService;
//     let featureRegistrationService: OverwolfFeatureRegistrationService;
//     let gameScenario: GameScenario;

//     beforeEach(async () => {
//         mockOverwolfAPI = new MockOverwolfAPI();
//         mockOverwolfAPI.install();
//         mockOverwolfAPI.mockOverwolfWindowName = "hud-match-timer";
//         await TestBed.configureTestingModule({
//             declarations: [MatchTimerWindowComponent, MockUIContainerComponent],
//             providers: [
//                 { provide: MockOverwolfAPI },
//                 { provide: ChangeDetectorRef, useValue: {} },
//                 { provide: MatchService },
//                 { provide: LocalDatabaseService },
//                 { provide: OverwolfFeatureRegistrationService },
//                 { provide: OW_CONFIG, useValue: OverwolfConfig },
//             ],
//         }).compileComponents();
//     });

//     beforeEach(() => {
//         jasmine.clock().uninstall();
//         jasmine.clock().install();
//         jasmine.clock().mockDate(new Date(0));
//         scheduler = new TestScheduler((actual, expected) => {
//             expect(actual).toEqual(expected);
//         });
//         scheduler.maxFrames = 5000;
//     });

//     afterEach(() => {
//         fixture.destroy();
//     });

//     // Cant use async or fakeAsync most likely
//     it("TEST", fakeAsync(() => {
//         scheduler.run(({ cold, expectObservable, hot }) => {
//             fixture = TestBed.createComponent(MatchTimerWindowComponent);
//             sut = fixture.componentInstance;
//             matchService = TestBed.inject(MatchService);
//             featureRegistrationService = TestBed.inject(OverwolfFeatureRegistrationService);
//             overwolfGameDataService = TestBed.inject(OverwolfGameDataService);
//             mockOverwolfAPI = TestBed.inject(MockOverwolfAPI);
//             mockOverwolfAPI.mockOverwolfWindowName = "hud-match-timer";
//             fixture.detectChanges(); // ngOnInit
//             // Arrange
//             const startDate = new Date("Jan 1, 2020 12:00:00 PM");
//             const endDate = new Date("Jan 1, 2020 12:12:34 PM");
//             jasmine.clock().mockDate(startDate);

//             featureRegistrationService.registrationStatus$
//                 .pipe(filter((status) => status === OWFeatureRegistrationStatus.SUCCESS))
//                 .subscribe((status) => {
//                     // Act
//                     jasmine.clock().tick(20 * 60 * 1000);
//                     tick(20 * 60 * 1000);
//                     const expected = differenceInMilliseconds(endDate, startDate);
//                     console.log(`Expected Duration: `, expected);
//                     gameScenario.run();
//                     console.log(`SUCCESSFUL... running game.3`);
//                     // jasmine.clock().tick(expected); // it stops here? whayyyy
//                     // tick(expected); // it stops here? whayyyy

//                     console.log(`SUCCESSFUL... running game.4`);
//                     // tick(expected);
//                     const actual = sut.matchDurationDate.getTime();
//                     console.log(`SUCCESSFUL... running game.5`);

//                     // Assert
//                     expect(actual).toBe(expected);
//                 });

//             const gameScenarioConfig = { scenarioName: "Match Timer Time Check", startDate, endDate };
//             gameScenario = gameScenarioBuilder.setup(gameScenarioConfig, mockOverwolfAPI).buildGameScenario();
//             gameScenario.run();

//             // flush(100);
//             // discardPeriodicTasks();
//             flush();
//             flushMicrotasks();
//             discardPeriodicTasks();
//         });

//         // flush();
//         discardPeriodicTasks();
//         expect(true).toBeTruthy();
//         // discardPeriodicTasks();
//         //---

//         // // Arrange
//         // const startDate = new Date("Jan 1, 2020 12:00:00 PM");
//         // const endDate = new Date("Jan 1, 2020 12:12:34 PM");
//         // const gameScenarioConfig = { scenarioName: "Match Timer Time Check", startDate, endDate };
//         // gameScenario = gameScenarioBuilder.setup(gameScenarioConfig, mockOverwolfAPI).buildGameScenario();

//         // // Act
//         // const expected = differenceInMilliseconds(endDate, startDate);
//         // gameScenario.run();
//         // tick(expected);
//         // const actual = sut.matchDurationDate.getTime();

//         // // Assert
//         // expect(sut.isDateValid).toBeTrue();
//         // expect(actual).toBe(expected);
//     }));
// });
