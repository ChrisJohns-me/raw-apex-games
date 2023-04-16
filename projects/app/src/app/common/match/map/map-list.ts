import { MatchGameModeGenericId } from "../game-mode/game-mode.enum";
import { MatchMapFriendlyName, MatchMapGenericId } from "./map.enum";
import { MatchMap } from "./match-map";

export const MatchMapList: MatchMap[] = [
    //#region Firing Range / Training Maps
    new MatchMap({
        mapName: MatchMapFriendlyName.FiringRange,
        mapGenericId: MatchMapGenericId.FiringRange,
        mapId: "mp_rr_canyonlands_staging",
        isChartable: false,
        isSandboxMap: true,
        gameModeTypes: [MatchGameModeGenericId.Training, MatchGameModeGenericId.FiringRange],
    }),
    //#endregion
    //#region Kings Canyon
    new MatchMap({
        mapName: MatchMapFriendlyName.KingsCanyon,
        mapGenericId: MatchMapGenericId.KingsCanyon,
        mapId: "mp_rr_canyonlands_mu3",
        gameModeTypes: [
            MatchGameModeGenericId.BattleRoyale_Duos,
            MatchGameModeGenericId.BattleRoyale_Trios,
            MatchGameModeGenericId.BattleRoyale_Ranked,
        ],
        chartConfig: {
            imageAxisScale: {
                xStart: -373,
                xEnd: 442,
                yStart: -371,
                yEnd: 441,
            },
        },
    }),
    //#endregion
    //#region Worlds Edge
    new MatchMap({
        mapName: MatchMapFriendlyName.WorldsEdge,
        mapGenericId: MatchMapGenericId.WorldsEdge,
        mapId: "mp_rr_desertlands_mu2",
        gameModeTypes: [
            MatchGameModeGenericId.BattleRoyale_Duos,
            MatchGameModeGenericId.BattleRoyale_Trios,
            MatchGameModeGenericId.BattleRoyale_Ranked,
        ],
        chartConfig: {
            imageAxisScale: {
                xStart: -450,
                xEnd: 450,
                yStart: -450,
                yEnd: 450,
            },
        },
    }),
    new MatchMap({
        mapName: MatchMapFriendlyName.WorldsEdge,
        mapGenericId: MatchMapGenericId.WorldsEdge,
        mapId: "mp_rr_desertlands_mu3",
        gameModeTypes: [
            MatchGameModeGenericId.BattleRoyale_Duos,
            MatchGameModeGenericId.BattleRoyale_Trios,
            MatchGameModeGenericId.BattleRoyale_Ranked,
        ],
        chartConfig: {
            imageAxisScale: {
                xStart: -450,
                xEnd: 450,
                yStart: -450,
                yEnd: 450,
            },
        },
    }),
    //#endregion
    //#region Olympus
    new MatchMap({
        mapName: MatchMapFriendlyName.Olympus,
        mapGenericId: MatchMapGenericId.Olympus,
        mapId: "mp_rr_olympus",
        gameModeTypes: [
            MatchGameModeGenericId.BattleRoyale_Duos,
            MatchGameModeGenericId.BattleRoyale_Trios,
            MatchGameModeGenericId.BattleRoyale_Ranked,
        ],
        chartConfig: {
            imageAxisScale: {
                xStart: -520,
                xEnd: 378,
                yStart: -421,
                yEnd: 480,
            },
        },
    }),
    new MatchMap({
        mapName: MatchMapFriendlyName.Olympus,
        mapGenericId: MatchMapGenericId.Olympus,
        mapId: "mp_rr_olympus_mu1",
        gameModeTypes: [
            MatchGameModeGenericId.BattleRoyale_Duos,
            MatchGameModeGenericId.BattleRoyale_Trios,
            MatchGameModeGenericId.BattleRoyale_Ranked,
        ],
        chartConfig: {
            imageAxisScale: {
                xStart: -520,
                xEnd: 378,
                yStart: -421,
                yEnd: 480,
            },
        },
    }),
    new MatchMap({
        mapName: MatchMapFriendlyName.Olympus,
        mapGenericId: MatchMapGenericId.Olympus,
        mapId: "mp_rr_olympus_mu2",
        gameModeTypes: [
            MatchGameModeGenericId.BattleRoyale_Duos,
            MatchGameModeGenericId.BattleRoyale_Trios,
            MatchGameModeGenericId.BattleRoyale_Ranked,
        ],
        chartConfig: {
            imageAxisScale: {
                xStart: -520,
                xEnd: 378,
                yStart: -421,
                yEnd: 480,
            },
        },
    }),
    //#endregion
    //#region Storm Point
    new MatchMap({
        mapName: MatchMapFriendlyName.StormPoint,
        mapGenericId: MatchMapGenericId.StormPoint,
        mapId: "mp_rr_tropic_island",
        gameModeTypes: [
            MatchGameModeGenericId.BattleRoyale_Duos,
            MatchGameModeGenericId.BattleRoyale_Trios,
            MatchGameModeGenericId.BattleRoyale_Ranked,
        ],
        chartConfig: {
            imageAxisScale: {
                xStart: -506,
                xEnd: 522,
                yStart: -511,
                yEnd: 525,
            },
        },
    }),
    new MatchMap({
        mapName: MatchMapFriendlyName.StormPoint,
        mapGenericId: MatchMapGenericId.StormPoint,
        mapId: "mp_rr_tropic_island_mu1",
        gameModeTypes: [
            MatchGameModeGenericId.BattleRoyale_Duos,
            MatchGameModeGenericId.BattleRoyale_Trios,
            MatchGameModeGenericId.BattleRoyale_Ranked,
        ],
        chartConfig: {
            imageAxisScale: {
                xStart: -506,
                xEnd: 522,
                yStart: -511,
                yEnd: 525,
            },
        },
    }),
    //#endregion
];

/**
 * Sorts maps Alphabetically
 */
export function sortMatchMapList(matchMapList: MatchMap[]): MatchMap[] {
    return matchMapList.slice().sort((a, b) => {
        if (a.mapName.toLowerCase() < b.mapName.toLowerCase()) return -1;
        if (a.mapName.toLowerCase() > b.mapName.toLowerCase()) return 1;
        return 0;
    });
}
