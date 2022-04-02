import { MatchGameModeGenericId } from "../game-mode/game-mode.enum";
import { latestGenericMap } from "./map-list";
import { MatchMapFriendlyName, MatchMapGenericId } from "./map.enum";
import { MatchMap } from "./match-map";

function createMap(id: string, activeDates: Array<{ from: Date; to?: Date }>, genericId = MatchMapGenericId.FiringRange): MatchMap {
    return new MatchMap({
        mapName: MatchMapFriendlyName.FiringRange,
        mapGenericId: genericId,
        mapId: id,
        isBattleRoyaleMap: false,
        isArenasMap: false,
        isControlMap: false,
        isChartable: false,
        gameModeTypes: [MatchGameModeGenericId.FiringRange],
        activeDates: activeDates,
    });
}

describe("Map List", () => {
    //#region sortMatchMapList
    //#endregion

    //#region latestMap
    it("should provide the active Map by genericID", () => {
        // Arrange
        const mapList: MatchMap[] = [
            createMap("map1_inactive1", [{ from: new Date("Jan 1, 2019"), to: new Date("Jan 1, 2020") }]),
            createMap("map1_latest", [{ from: new Date("Jan 1, 2021"), to: new Date("Jan 10, 2021") }]),
            createMap("map1_inactive2", [{ from: new Date("Jan 1, 2020"), to: new Date("Jan 1, 2021") }]),
            createMap("map2_inactive1", [{ from: new Date("Jan 1, 2019"), to: new Date("Jan 10, 2020") }], MatchMapGenericId.KingsCanyon),
            createMap("map2_active", [{ from: new Date("Jan 10, 2021") }], MatchMapGenericId.KingsCanyon),
            createMap("map2_inactive2", [{ from: new Date("Jan 1, 2020"), to: new Date("Jan 10, 2021") }], MatchMapGenericId.KingsCanyon),
        ];

        // Act
        const actual = latestGenericMap(MatchMapGenericId.FiringRange, mapList);

        // Assert
        expect(actual?.mapId).toBe("map1_latest");
    });

    it("should provide the inactive Map", () => {
        // Arrange
        const mapList: MatchMap[] = [createMap("inactive", [{ from: new Date("Jan 1, 2020"), to: new Date("Jan 1, 2021") }])];

        // Act
        const actual = latestGenericMap(MatchMapGenericId.FiringRange, mapList);

        // Assert
        expect(actual?.mapId).toBe("inactive");
    });

    it("should provide the active Map", () => {
        // Arrange
        const mapList: MatchMap[] = [createMap("active", [{ from: new Date("Jan 1, 2020") }])];

        // Act
        const actual = latestGenericMap(MatchMapGenericId.FiringRange, mapList);

        // Assert
        expect(actual?.mapId).toBe("active");
    });

    it("should provide the latest Map from basic active dates", () => {
        // Arrange
        const mapList: MatchMap[] = [
            createMap("inactive1", [{ from: new Date("Jan 1, 2019"), to: new Date("Jan 1, 2020") }]),
            createMap("inactive2", [{ from: new Date("Jan 1, 2020"), to: new Date("Jan 1, 2021") }]),
            createMap("active", [{ from: new Date("Jan 1, 2022") }]),
            createMap("inactive3", [{ from: new Date("Jan 1, 2021"), to: new Date("Jan 1, 2022") }]),
        ];

        // Act
        const actual = latestGenericMap(MatchMapGenericId.FiringRange, mapList);

        // Assert
        expect(actual?.mapId).toBe("active");
    });

    it("should provide the latest Map from empty active dates", () => {
        // Arrange
        const mapList: MatchMap[] = [
            createMap("inactive", [{ from: new Date("Jan 1, 2020"), to: new Date("Jan 1, 2021") }]),
            createMap("also_inactive", []),
        ];

        // Act
        const actual = latestGenericMap(MatchMapGenericId.FiringRange, mapList);

        // Assert
        expect(actual?.mapId).toBe("inactive");
    });

    it("should provide the latest Map from empty active dates", () => {
        // Arrange
        const mapList: MatchMap[] = [
            createMap("inactive1", [{ from: new Date("Jan 1, 2020"), to: new Date("Jan 1, 2021") }]),
            createMap("active", [{ from: new Date("Jan 1, 2020") }]),
            createMap("inactive2", []),
        ];

        // Act
        const actual = latestGenericMap(MatchMapGenericId.FiringRange, mapList);

        // Assert
        expect(actual?.mapId).toBe("active");
    });

    it("should provide the latest Map, with overlapping to/from dates", () => {
        // Arrange
        const mapList: MatchMap[] = [
            createMap("inactive1", [{ from: new Date("Jan 1, 2020"), to: new Date("Jan 5, 2021") }]),
            createMap("active", [{ from: new Date("Jan 4, 2021"), to: new Date("Jan 1, 2022") }]),
            createMap("inactive2", [{ from: new Date("Jan 1, 2019"), to: new Date("Jan 1, 2020") }]),
        ];

        // Act
        const actual = latestGenericMap(MatchMapGenericId.FiringRange, mapList);

        // Assert
        expect(actual?.mapId).toBe("active");
    });

    it("should provide the latest Map, with multiple to/from dates", () => {
        // Arrange
        const mapList: MatchMap[] = [
            createMap("inactive1", [
                { from: new Date("Jan 1, 2020"), to: new Date("Feb 1, 2020") },
                { from: new Date("Feb 1, 2020"), to: new Date("Mar 1, 2020") },
                { from: new Date("Mar 1, 2020"), to: new Date("Dec 31, 2020") },
            ]),
            createMap("active", [
                { from: new Date("Jan 1, 2021"), to: new Date("Feb 1, 2021") },
                { from: new Date("Feb 1, 2021"), to: new Date("Mar 1, 2021") },
                { from: new Date("Mar 1, 2021") },
            ]),
            createMap("inactive2", [
                { from: new Date("Jan 1, 2019"), to: new Date("Feb 1, 2019") },
                { from: new Date("Feb 1, 2019"), to: new Date("Mar 1, 2019") },
                { from: new Date("Mar 1, 2019"), to: new Date("Dec 31, 2019") },
            ]),
        ];

        // Act
        const actual = latestGenericMap(MatchMapGenericId.FiringRange, mapList);

        // Assert
        expect(actual?.mapId).toBe("active");
    });
    //#endregion
});
