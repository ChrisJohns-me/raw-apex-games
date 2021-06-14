import { MatchGameModeGenericId } from "../game-mode/game-mode.enum";
import { MatchMapFriendlyName, MatchMapGenericId } from "./map.enum";
import { MatchMap } from "./match-map";

export const MatchMapList: MatchMap[] = [
    //#region Firing Range / Training Maps
    new MatchMap({
        mapName: MatchMapFriendlyName.FiringRange,
        mapGenericId: MatchMapGenericId.FiringRange,
        mapId: "mp_rr_canyonlands_staging",
        isBattleRoyaleMap: false,
        isArenasMap: false,
        gameModeTypes: [MatchGameModeGenericId.FiringRange],
        activeDates: [
            {
                from: new Date(0),
            },
        ],
        dropshipZStart: -Infinity,
    }),
    //#endregion
    //#region Battle Royale Maps
    new MatchMap({
        mapName: MatchMapFriendlyName.KingsCanyon,
        mapGenericId: MatchMapGenericId.KingsCanyon,
        mapId: "mp_rr_canyonlands_mu3",
        isBattleRoyaleMap: true,
        isArenasMap: false,
        gameModeTypes: [
            MatchGameModeGenericId.BattleRoyale_Duos,
            MatchGameModeGenericId.BattleRoyale_Trios,
            MatchGameModeGenericId.BattleRoyale_Ranked,
        ],
        activeDates: [
            {
                from: new Date("June 23, 2020"),
            },
        ],
        dropshipZStart: 234,
        chartConfig: {
            imageAxisScale: {
                xStart: -373,
                xEnd: 442,
                yStart: -371,
                yEnd: 441,
            },
        },
    }),
    new MatchMap({
        mapName: MatchMapFriendlyName.WorldsEdge,
        mapGenericId: MatchMapGenericId.WorldsEdge,
        mapId: "mp_rr_desertlands_mu2",
        isBattleRoyaleMap: true,
        isArenasMap: false,
        gameModeTypes: [
            MatchGameModeGenericId.BattleRoyale_Duos,
            MatchGameModeGenericId.BattleRoyale_Trios,
            MatchGameModeGenericId.BattleRoyale_Ranked,
        ],
        activeDates: [
            {
                from: new Date("May 04, 2021"),
            },
        ],
        dropshipZStart: 146,
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
        mapName: MatchMapFriendlyName.Olympus,
        mapGenericId: MatchMapGenericId.Olympus,
        mapId: "mp_rr_olympus",
        isBattleRoyaleMap: true,
        isArenasMap: false,
        gameModeTypes: [
            MatchGameModeGenericId.BattleRoyale_Duos,
            MatchGameModeGenericId.BattleRoyale_Trios,
            MatchGameModeGenericId.BattleRoyale_Ranked,
        ],
        activeDates: [
            {
                from: new Date("January 04, 2021"),
                to: new Date("May 03, 2021"),
            },
        ],
        dropshipZStart: 119,
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
        isBattleRoyaleMap: true,
        isArenasMap: false,
        gameModeTypes: [
            MatchGameModeGenericId.BattleRoyale_Duos,
            MatchGameModeGenericId.BattleRoyale_Trios,
            MatchGameModeGenericId.BattleRoyale_Ranked,
        ],
        activeDates: [
            {
                from: new Date("May 04, 2021"),
            },
        ],
        dropshipZStart: 119,
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
    //#region Arena Maps
    new MatchMap({
        mapName: MatchMapFriendlyName.PhaseRunner,
        mapGenericId: MatchMapGenericId.PhaseRunner,
        mapId: "mp_rr_arena_phase_runner",
        isBattleRoyaleMap: false,
        isArenasMap: true,
        gameModeTypes: [MatchGameModeGenericId.Arenas],
        activeDates: [
            // {
            //     from: new Date("May 04, 2021"),
            // },
        ],
    }),
    new MatchMap({
        mapName: MatchMapFriendlyName.PartyCrasher,
        mapGenericId: MatchMapGenericId.PartyCrasher,
        mapId: "mp_rr_party_crasher",
        isBattleRoyaleMap: false,
        isArenasMap: true,
        gameModeTypes: [MatchGameModeGenericId.Arenas],
        activeDates: [
            // {
            //     from: new Date("May 04, 2021"),
            // },
        ],
    }),
    new MatchMap({
        mapName: MatchMapFriendlyName.Artillary,
        mapGenericId: MatchMapGenericId.Artillary,
        mapId: "mp_rr_canyonlands_mu3_arena", // TODO: Check
        isBattleRoyaleMap: false,
        isArenasMap: true,
        gameModeTypes: [MatchGameModeGenericId.Arenas],
        activeDates: [
            // {
            //     from: new Date("May 04, 2021"),
            // },
        ],
    }),
    new MatchMap({
        mapName: MatchMapFriendlyName.ThermalStation,
        mapGenericId: MatchMapGenericId.ThermalStation,
        mapId: "mp_rr_desertlands_mu2_arena", // TODO: Check
        isBattleRoyaleMap: false,
        isArenasMap: true,
        gameModeTypes: [MatchGameModeGenericId.Arenas],
        activeDates: [
            // {
            //     from: new Date("May 04, 2021"),
            // },
        ],
    }),
    new MatchMap({
        mapName: MatchMapFriendlyName.GoldenGardens,
        mapGenericId: MatchMapGenericId.GoldenGardens,
        mapId: "mp_rr_olympus_arena", // TODO: Check
        isBattleRoyaleMap: false,
        isArenasMap: true,
        gameModeTypes: [MatchGameModeGenericId.Arenas],
        activeDates: [
            // {
            //     from: new Date("June 01, 2021"),
            // },
        ],
    }),
    //#endregion
];

/**
 * Sorts by:
 *  - Non-battle royale & non-arenas maps first
 *  - Battle Royale maps second
 *  - Arenas maps third
 *  - Alphabetically
 */
export function sortMatchMapList(matchMapList: MatchMap[]): MatchMap[] {
    return matchMapList.sort((a, b) => {
        if ((!a.isBattleRoyaleMap && !a.isArenasMap && b.isBattleRoyaleMap) || b.isArenasMap) return -1;
        if ((a.isBattleRoyaleMap && a.isArenasMap && !b.isBattleRoyaleMap) || !b.isArenasMap) return 1;
        if (a.isBattleRoyaleMap && !b.isBattleRoyaleMap) return -1;
        if (!a.isBattleRoyaleMap && b.isBattleRoyaleMap) return 1;
        if (a.isArenasMap && !b.isArenasMap) return -1;
        if (!a.isArenasMap && b.isArenasMap) return 1;
        if (a.mapName.toLowerCase() < b.mapName.toLowerCase()) return -1;
        if (a.mapName.toLowerCase() > b.mapName.toLowerCase()) return 1;
        return 0;
    });
}
