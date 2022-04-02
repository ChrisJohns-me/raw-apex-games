import { MatchGameModeGenericId } from "../game-mode/game-mode.enum";
import { MatchMapListArenasMaps } from "./map-list/arenas-maps";
import { MatchMapListBattleRoyalMaps } from "./map-list/battle-royal-maps";
import { MatchMapListControlMaps } from "./map-list/control-maps";
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
        isControlMap: false,
        isChartable: false,
        gameModeTypes: [MatchGameModeGenericId.Training, MatchGameModeGenericId.FiringRange],
        activeDates: [
            {
                from: new Date(0),
            },
        ],
        zStartPos: -Infinity,
    }),
    //#endregion
    ...MatchMapListBattleRoyalMaps,
    ...MatchMapListArenasMaps,
    ...MatchMapListControlMaps,
];

/**
 * Sorts by:
 *  - Battle Royale maps first
 *  - Arenas maps second
 *  - Control maps third
 *  - Alphabetically
 */
export function sortMatchMapList(matchMapList: MatchMap[]): MatchMap[] {
    return matchMapList.sort((a, b) => {
        if (a.isBattleRoyaleMap && !b.isBattleRoyaleMap) return -1;
        if (!a.isBattleRoyaleMap && b.isBattleRoyaleMap) return 1;
        if (a.isArenasMap && !b.isArenasMap) return -1;
        if (!a.isArenasMap && b.isArenasMap) return 1;
        if (a.isControlMap && !b.isControlMap) return -1;
        if (!a.isControlMap && b.isControlMap) return 1;
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
