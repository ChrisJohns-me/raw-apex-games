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
    return matchMapList.slice().sort((a, b) => {
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
