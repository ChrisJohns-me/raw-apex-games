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
        isChartable: false,
        gameModeTypes: [MatchGameModeGenericId.FiringRange],
        activeDates: [
            {
                from: new Date(0),
            },
        ],
        zStartPos: -Infinity,
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
    //#region Arena Maps
    new MatchMap({
        mapName: MatchMapFriendlyName.PhaseRunner,
        mapGenericId: MatchMapGenericId.PhaseRunner,
        mapId: "mp_rr_arena_phase_runner",
        isBattleRoyaleMap: false,
        isArenasMap: true,
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
        isChartable: false,
        gameModeTypes: [MatchGameModeGenericId.Arenas],
        activeDates: [
            // {
            //     from: new Date("August 01, 2021"),
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

/**
 * Removes duplicate Maps from the provided Map List
 * @returns latest map based on the GenericId
 */
export function latestGenericMap(genericId: MatchMapGenericId, matchMapList: MatchMap[]): Optional<MatchMap> {
    const activeDatesSortFn = (
        a: { from: Date; to?: Date | undefined } | undefined,
        b: { from: Date; to?: Date | undefined } | undefined
    ): number => {
        // Active = { from: ... }
        const aIsActive = !!a && !!a.from && !a.to;
        const bIsActive = !!b && !!b.from && !b.to;
        // Maybe active = { from: ..., to: ... }
        const aIsMaybeActive = !!a && !!a.from && !!a.to;
        const bIsMaybeActive = !!b && !!b.from && !!b.to;
        // Inactive = {}
        const aIsInactive = !a;
        const bIsInactive = !b;

        if (aIsActive) {
            if (bIsMaybeActive) return -1;
            if (bIsInactive) return -1;
            return b!.from.getTime() - a!.from.getTime();
        }
        if (aIsMaybeActive) {
            if (bIsActive) return 1;
            if (bIsInactive) return -1;
            return b!.to!.getTime() - a!.to!.getTime();
        }
        if (aIsInactive) {
            if (bIsActive) return 1;
            if (bIsMaybeActive) return 1;
        }
        return 0;
    };
    const latestMapActiveDatesFn = (activeDates: Array<{ from: Date; to?: Date }>): { from: Date; to?: Date } => {
        return activeDates.sort(activeDatesSortFn)[0];
    };

    let latestMap: Optional<MatchMap>;
    matchMapList // Sort Descending
        .sort((a, b) => {
            const aLatest = a.activeDates?.length ? latestMapActiveDatesFn(a.activeDates) : undefined;
            const bLatest = b.activeDates?.length ? latestMapActiveDatesFn(b.activeDates) : undefined;

            if (aLatest && bLatest) return activeDatesSortFn(aLatest, bLatest);
            if (!aLatest && bLatest) return -1;
            if (aLatest && !bLatest) return 1;
            return 0;
        })
        .forEach((iterationMap) => {
            if (!iterationMap || iterationMap.mapGenericId !== genericId) return;
            if (!latestMap) {
                latestMap = iterationMap;
                return;
            }
            const iterationMapDates = iterationMap.activeDates?.length ? latestMapActiveDatesFn(iterationMap.activeDates) : undefined;
            const latestMapDates = latestMap?.activeDates?.length ? latestMapActiveDatesFn(latestMap.activeDates) : undefined;
            const sortResult = activeDatesSortFn(iterationMapDates, latestMapDates);

            // Iteration map is later
            if (sortResult === -1) {
                latestMap = iterationMap;
            }
        });
    return latestMap;
}
