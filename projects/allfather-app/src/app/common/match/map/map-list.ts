import { MatchGameModeType } from "../game-mode";
import { MatchMapFriendlyName, MatchMapGenericId } from "./map.enum";
import { MatchMap } from "./match-map";

export const MatchMapList: MatchMap[] = [
    // Firing Range / Training Maps
    new MatchMap({
        mapName: MatchMapFriendlyName.FiringRange,
        genericId: MatchMapGenericId.FiringRange,
        mapId: "mp_rr_canyonlands_staging",
        gameModeTypes: [MatchGameModeType.FiringRange],
        activeDates: [
            {
                from: new Date(0),
            },
        ],
        dropshipZStart: -Infinity,
    }),
    // Battle Royale Maps
    new MatchMap({
        mapName: MatchMapFriendlyName.KingsCanyon,
        genericId: MatchMapGenericId.KingsCanyon,
        mapId: "mp_rr_canyonlands_mu3",
        gameModeTypes: [MatchGameModeType.BattleRoyale_Duos, MatchGameModeType.BattleRoyale_Trios, MatchGameModeType.BattleRoyale_Ranked],
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
        genericId: MatchMapGenericId.WorldsEdge,
        mapId: "mp_rr_desertlands_mu2",
        gameModeTypes: [MatchGameModeType.BattleRoyale_Duos, MatchGameModeType.BattleRoyale_Trios, MatchGameModeType.BattleRoyale_Ranked],
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
        genericId: MatchMapGenericId.Olympus,
        mapId: "mp_rr_olympus",
        gameModeTypes: [MatchGameModeType.BattleRoyale_Duos, MatchGameModeType.BattleRoyale_Trios, MatchGameModeType.BattleRoyale_Ranked],
        activeDates: [
            {
                from: new Date("January 04, 2021"),
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
    // Arena Maps
    new MatchMap({
        mapName: MatchMapFriendlyName.PhaseRunner,
        genericId: MatchMapGenericId.PhaseRunner,
        mapId: "mp_rr_arena_phase_runner",
        gameModeTypes: [MatchGameModeType.Arenas],
        activeDates: [
            {
                from: new Date("May 04, 2021"),
            },
        ],
    }),
    new MatchMap({
        mapName: MatchMapFriendlyName.PartyCrasher,
        genericId: MatchMapGenericId.PartyCrasher,
        mapId: "mp_rr_party_crasher",
        gameModeTypes: [MatchGameModeType.Arenas],
        activeDates: [
            {
                from: new Date("May 04, 2021"),
            },
        ],
    }),
    new MatchMap({
        mapName: MatchMapFriendlyName.Artillary,
        genericId: MatchMapGenericId.Artillary,
        mapId: "mp_rr_canyonlands_mu3", // TODO: Check
        gameModeTypes: [MatchGameModeType.Arenas],
        activeDates: [
            {
                from: new Date("May 04, 2021"),
            },
        ],
    }),
    new MatchMap({
        mapName: MatchMapFriendlyName.ThermalStation,
        genericId: MatchMapGenericId.ThermalStation,
        mapId: "mp_rr_desertlands_mu2", // TODO: Check
        gameModeTypes: [MatchGameModeType.Arenas],
        activeDates: [
            {
                from: new Date("May 04, 2021"),
            },
        ],
    }),
    new MatchMap({
        mapName: MatchMapFriendlyName.GoldenGardens,
        genericId: MatchMapGenericId.GoldenGardens,
        mapId: "mp_rr_olympus", // TODO: Check
        gameModeTypes: [MatchGameModeType.Arenas],
        activeDates: [
            {
                from: new Date("Jan 01, 2025"),
            },
        ],
    }),
];
