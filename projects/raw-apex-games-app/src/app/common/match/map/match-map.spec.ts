import { MatchMapFriendlyName, MatchMapGenericId } from "./map.enum";
import { MatchMap } from "./match-map";

describe("MatchMap", () => {
    describe("getFromFriendlyName", () => {
        it("should return the latest map", () => {
            // Arrange
            const matchMapList: MatchMap[] = [
                new MatchMap({
                    mapName: MatchMapFriendlyName.FiringRange,
                    mapGenericId: MatchMapGenericId.FiringRange,
                    mapId: "map_original_firing_range",
                }),
                new MatchMap({
                    mapName: MatchMapFriendlyName.FiringRange,
                    mapGenericId: MatchMapGenericId.FiringRange,
                    mapId: "map_firing_range_update2",
                }),
                new MatchMap({
                    mapName: MatchMapFriendlyName.FiringRange,
                    mapGenericId: MatchMapGenericId.FiringRange,
                    mapId: "map_firing_range_update1",
                }),
            ];

            // Act
            const result = MatchMap.getFromFriendlyName("firing range", matchMapList);

            // Assert
            expect(result?.mapId).toBe("map_firing_range_update2");
        });
    });
});
