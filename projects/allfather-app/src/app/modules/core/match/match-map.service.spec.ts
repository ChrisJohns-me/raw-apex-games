import { MatchGameMode } from "@allfather-app/app/common/match/game-mode/game-mode";
import { MatchGameModeFriendlyName, MatchGameModeGenericId } from "@allfather-app/app/common/match/game-mode/game-mode.enum";
import { MatchMapCoordinates } from "@allfather-app/app/common/match/map/map-coordinates";
import { MatchMapFriendlyName, MatchMapGenericId } from "@allfather-app/app/common/match/map/map.enum";
import { MatchMap } from "@allfather-app/app/common/match/map/match-map";
import { MatchState, MatchStateChangedEvent } from "@allfather-app/app/common/match/state";
import { supressConsoleLog } from "@allfather-app/app/common/testing-helpers";
import { TestBed } from "@angular/core/testing";
import { addDays, subDays } from "date-fns";
import { TestScheduler } from "rxjs/testing";
import { MapRotationService } from "../map-rotation/map-rotation.service";
import { MockMapRotationService } from "../mocks/services/mock-map-rotation.service";
import { MockMatchLegendSelectService } from "../mocks/services/mock-match-legend-select.service";
import { MockMatchPlayerLocationService } from "../mocks/services/mock-match-player-location.service";
import { MockMatchService } from "../mocks/services/mock-match.service";
import { MatchLegendSelectService } from "./match-legend-select.service";
import { MatchMapService } from "./match-map.service";
import { MatchPlayerLocationService } from "./match-player-location.service";
import { MatchService } from "./match.service";

describe("MatchMapService", () => {
    let sut: MatchMapService;
    let scheduler: TestScheduler;
    let matchService: MatchService;
    let mapRotationService: MapRotationService;
    let matchPlayerLocationService: MatchPlayerLocationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                { provide: MatchService, useClass: MockMatchService },
                { provide: MapRotationService, useClass: MockMapRotationService },
                { provide: MatchPlayerLocationService, useClass: MockMatchPlayerLocationService },
                { provide: MatchLegendSelectService, useClass: MockMatchLegendSelectService },
                MatchMapService,
            ],
        });
    });

    beforeEach(() => {
        supressConsoleLog();
        jasmine.clock().uninstall();
        jasmine.clock().install();
        scheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
        sut = TestBed.inject(MatchMapService);
        matchService = TestBed.inject(MatchService);
        mapRotationService = TestBed.inject(MapRotationService);
        matchPlayerLocationService = TestBed.inject(MatchPlayerLocationService);
    });

    describe("map$", () => {
        it("should infer map based on z location", () => {
            scheduler.run(({ cold, expectObservable }) => {
                // Arrange
                const startDate = new Date("2020-01-01T00:00:00");
                const matchMapList: MatchMap[] = [
                    new MatchMap({
                        mapName: MatchMapFriendlyName.FiringRange,
                        mapGenericId: MatchMapGenericId.FiringRange,
                        mapId: "mp_rr_canyonlands_staging",
                        isBattleRoyaleMap: false,
                        isArenasMap: false,
                        isControlMap: false,
                        gameModeTypes: [MatchGameModeGenericId.Training, MatchGameModeGenericId.FiringRange],
                        activeDates: [
                            {
                                from: startDate,
                                to: addDays(startDate, 1),
                            },
                        ],
                        zStartPos: 123,
                    }),
                    new MatchMap({
                        mapName: MatchMapFriendlyName.FiringRange,
                        mapGenericId: MatchMapGenericId.FiringRange,
                        mapId: "mp_rr_canyonlands_tester",
                        isBattleRoyaleMap: false,
                        isArenasMap: false,
                        isControlMap: false,
                        gameModeTypes: [MatchGameModeGenericId.Training, MatchGameModeGenericId.FiringRange],
                        activeDates: [
                            {
                                from: startDate,
                                to: addDays(startDate, 1),
                            },
                        ],
                        zStartPos: 456,
                    }),
                ];
                const startEvent: MatchStateChangedEvent = {
                    startDate: startDate,
                    state: MatchState.Active,
                    matchId: "test",
                };
                const startingCoordinates: MatchMapCoordinates = {
                    x: 0,
                    y: 0,
                    z: 123,
                };

                // Act
                spyOnProperty<any>(sut, "matchMapList").and.returnValue(matchMapList);

                jasmine.clock().mockDate(startDate);
                cold("a--", { a: startEvent }).subscribe(matchService.startedEvent$);
                cold("a--", { a: startEvent }).subscribe(matchService.state$);
                cold("-a-", { a: startingCoordinates }).subscribe(matchPlayerLocationService.myStartingCoordinates$);

                // Assert
                expectObservable(sut.map$).toBe("u1-", {
                    u: undefined,
                    1: matchMapList[0],
                });
            });
        });

        it("should infer map based on game mode type + map rotation as backup", () => {
            scheduler.run(({ cold, expectObservable }) => {
                // Arrange
                const startDate = new Date("2020-01-01T00:00:00");
                const matchMapList: MatchMap[] = [
                    new MatchMap({
                        mapName: MatchMapFriendlyName.FiringRange,
                        mapGenericId: MatchMapGenericId.FiringRange,
                        mapId: "mp_rr_canyonlands_staging",
                        isBattleRoyaleMap: false,
                        isArenasMap: false,
                        isControlMap: false,
                        gameModeTypes: [MatchGameModeGenericId.Training, MatchGameModeGenericId.FiringRange],
                        activeDates: [
                            {
                                from: subDays(startDate, 365),
                                to: subDays(startDate, 305),
                            },
                        ],
                        zStartPos: 123,
                    }),
                    new MatchMap({
                        mapName: MatchMapFriendlyName.FiringRange,
                        mapGenericId: MatchMapGenericId.FiringRange,
                        mapId: "mp_rr_canyonlands_tester",
                        isBattleRoyaleMap: false,
                        isArenasMap: false,
                        isControlMap: false,
                        gameModeTypes: [MatchGameModeGenericId.Training, MatchGameModeGenericId.FiringRange],
                        activeDates: [
                            {
                                from: startDate,
                            },
                        ],
                        zStartPos: 456,
                    }),
                ];
                const startEvent: MatchStateChangedEvent = {
                    startDate: startDate,
                    state: MatchState.Active,
                    matchId: "test",
                };
                const gameModeList = [
                    new MatchGameMode({
                        gameModeId: "#PL_TRAINING",
                        gameModeGenericId: MatchGameModeGenericId.Training,
                        gameModeName: MatchGameModeFriendlyName.Training,
                        isBattleRoyaleGameMode: false,
                        isArenasGameMode: false,
                        isControlGameMode: false,
                    }),
                ];
                const gameMode = MatchGameMode.getFromId(gameModeList, "#PL_TRAINING");
                const startingCoordinates: MatchMapCoordinates = {
                    x: 0,
                    y: 0,
                    z: 0,
                };

                // Act
                spyOnProperty<any>(sut, "matchMapList").and.returnValue(matchMapList);
                spyOn(mapRotationService, "getCurrentMapFromGameMode").and.returnValue(matchMapList[0]);

                jasmine.clock().mockDate(startDate);
                cold("a--", { a: startEvent }).subscribe(matchService.startedEvent$);
                cold("a--", { a: startEvent }).subscribe(matchService.state$);
                cold("a--", { a: gameMode }).subscribe(matchService.gameMode$);
                cold("-a-", { a: startingCoordinates }).subscribe(matchPlayerLocationService.myStartingCoordinates$);

                // Assert
                expectObservable(sut.map$).toBe("u1-", {
                    u: undefined,
                    1: matchMapList[0],
                });
            });
        });
    }); // map$
});
