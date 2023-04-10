import { MatchGameModeGenericId } from "../../game-mode/game-mode.enum";
import { MatchMapFriendlyName, MatchMapGenericId } from "../map.enum";
import { MatchMap } from "../match-map";

export const MatchMapListArenasMaps = [
    new MatchMap({
        mapName: MatchMapFriendlyName.PhaseRunner,
        mapGenericId: MatchMapGenericId.PhaseRunner,
        mapId: "mp_rr_arena_phase_runner",
        isBattleRoyaleMap: false,
        isArenasMap: true,
        isControlMap: false,
        isChartable: false,
        gameModeTypes: [MatchGameModeGenericId.Arenas],
        activeDates: [
            {
                from: new Date("May 04, 2021"),
            },
        ],
    }),
    new MatchMap({
        mapName: MatchMapFriendlyName.PartyCrasher,
        mapGenericId: MatchMapGenericId.PartyCrasher,
        mapId: "mp_rr_party_crasher",
        isBattleRoyaleMap: false,
        isArenasMap: true,
        isControlMap: false,
        isChartable: false,
        gameModeTypes: [MatchGameModeGenericId.Arenas],
        activeDates: [
            {
                from: new Date("May 04, 2021"),
            },
        ],
    }),
    new MatchMap({
        mapName: MatchMapFriendlyName.Artillery,
        mapGenericId: MatchMapGenericId.Artillery,
        mapId: "mp_rr_canyonlands_mu3_arena", // TODO: Check
        isBattleRoyaleMap: false,
        isArenasMap: true,
        isControlMap: false,
        isChartable: false,
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
        isControlMap: false,
        isChartable: false,
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
        isControlMap: false,
        isChartable: false,
        gameModeTypes: [MatchGameModeGenericId.Arenas],
        activeDates: [
            // {
            //     from: new Date("June 01, 2021"),
            // },
        ],
    }),
    new MatchMap({
        mapName: MatchMapFriendlyName.SkullTown,
        mapGenericId: MatchMapGenericId.SkullTown,
        mapId: "mp_rr_canyonlands_mu3_arena", // TODO: Check
        isBattleRoyaleMap: false,
        isArenasMap: true,
        isControlMap: false,
        isChartable: false,
        gameModeTypes: [MatchGameModeGenericId.Arenas],
        activeDates: [
            // {
            //     from: new Date("June 29, 2021"),
            // },
        ],
    }),
    new MatchMap({
        mapName: MatchMapFriendlyName.Overflow,
        mapGenericId: MatchMapGenericId.Overflow,
        mapId: "mp_rr_aqueduct", // TODO: Check
        isBattleRoyaleMap: false,
        isArenasMap: true,
        isControlMap: false,
        isChartable: false,
        gameModeTypes: [MatchGameModeGenericId.Arenas],
        activeDates: [
            // {
            //     from: new Date("August 01, 2021"),
            // },
        ],
    }),
    new MatchMap({
        mapName: MatchMapFriendlyName.Oasis,
        mapGenericId: MatchMapGenericId.Oasis,
        mapId: "mp_rr_oasis", // TODO: Check
        isBattleRoyaleMap: false,
        isArenasMap: true,
        isControlMap: false,
        isChartable: false,
        gameModeTypes: [MatchGameModeGenericId.Arenas],
        activeDates: [
            // {
            //     from: new Date("August 01, 2021"),
            // },
        ],
    }),
    new MatchMap({
        mapName: MatchMapFriendlyName.Habitat,
        mapGenericId: MatchMapGenericId.Habitat,
        mapId: "mp_rr_habitat", // TODO: Check
        isBattleRoyaleMap: false,
        isArenasMap: true,
        isControlMap: false,
        isChartable: false,
        gameModeTypes: [MatchGameModeGenericId.Arenas],
        activeDates: [
            // {
            //     from: new Date("August 01, 2021"),
            // },
        ],
    }),
    new MatchMap({
        mapName: MatchMapFriendlyName.Encore,
        mapGenericId: MatchMapGenericId.Encore,
        mapId: "mp_rr_encore", // TODO: Check
        isBattleRoyaleMap: false,
        isArenasMap: true,
        isControlMap: false,
        isChartable: false,
        gameModeTypes: [MatchGameModeGenericId.Arenas],
        activeDates: [
            // {
            //     from: new Date("August 01, 2021"),
            // },
        ],
    }),
];
