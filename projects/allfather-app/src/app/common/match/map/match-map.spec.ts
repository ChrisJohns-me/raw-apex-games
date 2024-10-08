import { addDays, subDays } from "date-fns";
import { supressConsoleLog } from "../../testing-helpers";
import { MatchMapFriendlyName, MatchMapGenericId } from "./map.enum";
import { MatchMap } from "./match-map";

describe("MatchMap", () => {
    describe("isActive", () => {
        beforeEach(() => {
            supressConsoleLog();
            jasmine.clock().uninstall();
            jasmine.clock().install();
        });

        it("should return true if the current date is between map's activeDates", () => {
            // Arrange
            const fakeNow = new Date("2020-01-01T00:00:00");
            const sut = new MatchMap({
                mapName: MatchMapFriendlyName.FiringRange,
                mapGenericId: MatchMapGenericId.FiringRange,
                mapId: "mp_rr_canyonlands_staging",
                isBattleRoyaleMap: false,
                isArenasMap: false,
                isControlMap: false,
                activeDates: [
                    {
                        from: subDays(fakeNow, 400),
                        to: subDays(fakeNow, 350),
                    },
                    {
                        from: subDays(fakeNow, 300),
                        to: subDays(fakeNow, 250),
                    },
                    {
                        from: subDays(fakeNow, 200),
                        to: subDays(fakeNow, 150),
                    },
                    {
                        from: subDays(fakeNow, 14),
                        to: addDays(fakeNow, 14),
                    },
                ],
            });

            // Act
            jasmine.clock().mockDate(fakeNow);

            // Assert
            expect(sut.isActive).toBe(true);
        });

        it("should return true if the 'to' active date is undefined", () => {
            // Arrange
            const fakeNow = new Date("2020-01-01T00:00:00");
            const sut = new MatchMap({
                mapName: MatchMapFriendlyName.FiringRange,
                mapGenericId: MatchMapGenericId.FiringRange,
                mapId: "mp_rr_canyonlands_staging",
                isBattleRoyaleMap: false,
                isArenasMap: false,
                isControlMap: false,
                activeDates: [
                    {
                        from: subDays(fakeNow, 400),
                        to: subDays(fakeNow, 350),
                    },
                    {
                        from: subDays(fakeNow, 300),
                        to: subDays(fakeNow, 250),
                    },
                    {
                        from: subDays(fakeNow, 200),
                        to: subDays(fakeNow, 150),
                    },
                    {
                        from: subDays(fakeNow, 14),
                    },
                ],
            });

            // Act
            jasmine.clock().mockDate(fakeNow);

            // Assert
            expect(sut.isActive).toBe(true);
        });

        it("should return false if current date is not between any activeDates", () => {
            // Arrange
            const fakeNow = new Date("2020-01-01T00:00:00");
            const sut = new MatchMap({
                mapName: MatchMapFriendlyName.FiringRange,
                mapGenericId: MatchMapGenericId.FiringRange,
                mapId: "mp_rr_canyonlands_staging",
                isBattleRoyaleMap: false,
                isArenasMap: false,
                isControlMap: false,
                activeDates: [
                    {
                        from: subDays(fakeNow, 400),
                        to: subDays(fakeNow, 350),
                    },
                    {
                        from: subDays(fakeNow, 300),
                        to: subDays(fakeNow, 250),
                    },
                    {
                        from: subDays(fakeNow, 200),
                        to: subDays(fakeNow, 150),
                    },
                ],
            });

            // Act
            jasmine.clock().mockDate(fakeNow);

            // Assert
            expect(sut.isActive).toBe(false);
        });
    });

    describe("getFromFriendlyName", () => {
        it("should return the latest map", () => {
            // Arrange
            const matchMapList: MatchMap[] = [
                new MatchMap({
                    mapName: MatchMapFriendlyName.FiringRange,
                    mapGenericId: MatchMapGenericId.FiringRange,
                    mapId: "map_original_firing_range",
                    isBattleRoyaleMap: false,
                    isArenasMap: false,
                    isControlMap: false,
                    activeDates: [
                        {
                            from: new Date("2020-01-01T00:00:00"),
                            to: new Date("2020-01-02T00:00:00"),
                        },
                    ],
                }),
                new MatchMap({
                    mapName: MatchMapFriendlyName.FiringRange,
                    mapGenericId: MatchMapGenericId.FiringRange,
                    mapId: "map_firing_range_update2",
                    isBattleRoyaleMap: false,
                    isArenasMap: false,
                    isControlMap: false,
                    activeDates: [
                        {
                            from: new Date("2020-01-02T00:00:00"),
                        },
                    ],
                }),
                new MatchMap({
                    mapName: MatchMapFriendlyName.FiringRange,
                    mapGenericId: MatchMapGenericId.FiringRange,
                    mapId: "map_firing_range_update1",
                    isBattleRoyaleMap: false,
                    isArenasMap: false,
                    isControlMap: false,
                    activeDates: [
                        {
                            from: new Date("2020-01-02T00:00:00"),
                            to: new Date("2020-01-03T00:00:00"),
                        },
                    ],
                }),
            ];

            // Act
            const result = MatchMap.getFromFriendlyName("firing range", matchMapList);

            // Assert
            expect(result?.mapId).toBe("map_firing_range_update2");
        });
    });
});
