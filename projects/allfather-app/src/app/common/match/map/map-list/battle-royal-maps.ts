import { MatchGameModeGenericId } from "../../game-mode/game-mode.enum";
import { MatchMapFriendlyName, MatchMapGenericId } from "../map.enum";
import { MatchMap } from "../match-map";

export const MatchMapListBattleRoyalMaps = [
    //#region Kings Canyon
    new MatchMap({
        mapName: MatchMapFriendlyName.KingsCanyon,
        mapGenericId: MatchMapGenericId.KingsCanyon,
        mapId: "mp_rr_canyonlands_mu3",
        isBattleRoyaleMap: true,
        isArenasMap: false,
        isControlMap: false,
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
        zStartPos: 234,
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
        isBattleRoyaleMap: true,
        isArenasMap: false,
        isControlMap: false,
        gameModeTypes: [
            MatchGameModeGenericId.BattleRoyale_Duos,
            MatchGameModeGenericId.BattleRoyale_Trios,
            MatchGameModeGenericId.BattleRoyale_Ranked,
        ],
        activeDates: [
            {
                from: new Date("May 04, 2021"),
                to: new Date("August 03, 2021"),
            },
        ],
        zStartPos: 146,
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
        isBattleRoyaleMap: true,
        isArenasMap: false,
        isControlMap: false,
        gameModeTypes: [
            MatchGameModeGenericId.BattleRoyale_Duos,
            MatchGameModeGenericId.BattleRoyale_Trios,
            MatchGameModeGenericId.BattleRoyale_Ranked,
        ],
        activeDates: [
            {
                from: new Date("August 03, 2021"),
            },
        ],
        zStartPos: 146,
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
        isBattleRoyaleMap: true,
        isArenasMap: false,
        isControlMap: false,
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
        zStartPos: 119,
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
        isControlMap: false,
        gameModeTypes: [
            MatchGameModeGenericId.BattleRoyale_Duos,
            MatchGameModeGenericId.BattleRoyale_Trios,
            MatchGameModeGenericId.BattleRoyale_Ranked,
        ],
        activeDates: [
            {
                from: new Date("May 04, 2021"),
                to: new Date("Feb 7, 2022"),
            },
        ],
        zStartPos: 119,
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
        isBattleRoyaleMap: true,
        isArenasMap: false,
        isControlMap: false,
        gameModeTypes: [
            MatchGameModeGenericId.BattleRoyale_Duos,
            MatchGameModeGenericId.BattleRoyale_Trios,
            MatchGameModeGenericId.BattleRoyale_Ranked,
        ],
        activeDates: [
            {
                from: new Date("Feb 8, 2022"),
            },
        ],
        zStartPos: 119,
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
        isBattleRoyaleMap: true,
        isArenasMap: false,
        isControlMap: false,
        gameModeTypes: [
            MatchGameModeGenericId.BattleRoyale_Duos,
            MatchGameModeGenericId.BattleRoyale_Trios,
            MatchGameModeGenericId.BattleRoyale_Ranked,
        ],
        activeDates: [
            {
                from: new Date("Nov 02, 2021"),
                to: new Date("May 09, 2022"),
            },
        ],
        zStartPos: 254,
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
        isBattleRoyaleMap: true,
        isArenasMap: false,
        isControlMap: false,
        gameModeTypes: [
            MatchGameModeGenericId.BattleRoyale_Duos,
            MatchGameModeGenericId.BattleRoyale_Trios,
            MatchGameModeGenericId.BattleRoyale_Ranked,
        ],
        activeDates: [
            {
                from: new Date("May 10, 2022"),
            },
        ],
        zStartPos: 254,
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
