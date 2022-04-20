import { MatchDataStore } from "@allfather-app/app/modules/core/local-database/match-data-store";
import { cleanInt, isEmpty } from "common/utilities";
import { unique } from "common/utilities/primitives/array";
import { Legend } from "../legend/legend";
import { LegendList, sortLegendList } from "../legend/legend-list";
import { MatchGameMode } from "../match/game-mode/game-mode";
import { MatchGameModeList, sortMatchGameModeList } from "../match/game-mode/game-mode-list";
import { MatchGameModeGenericId } from "../match/game-mode/game-mode.enum";
import { latestGenericMap, MatchMapList, sortMatchMapList } from "../match/map/map-list";
import { MatchMap } from "../match/map/match-map";

/**
 * @class StaticMatchFilters
 * @classdesc Static Functions for the MatchFilters class
 */
class StaticMatchFilters {
    /** @returns All non-training and non-firing range maps */
    public static getNonTrainingMapList(): MatchMap[] {
        return MatchMapList.filter((m) => m.isBattleRoyaleMap || m.isArenasMap || m.isControlMap);
    }

    /** @returns The latest (generic) MatchMaps from a given mapList; or if undefined, defaults to non-training and non-firing range maps */
    public static getGenericMapList(mapList?: MatchMap[]): MatchMap[] {
        if (!mapList) mapList = StaticMatchFilters.getNonTrainingMapList();
        const genericMapList = mapList.map((m) => latestGenericMap(m.mapGenericId, mapList!)).filter((m) => !!m) as MatchMap[];
        return unique(genericMapList, (m) => m.mapGenericId);
    }

    /** @returns All non-training and non-firing range game modes */
    public static getNonTrainingGameModeList(afSupportedOnly = true): MatchGameMode[] {
        return MatchGameModeList.filter(
            (g) => g.isAFSupported == afSupportedOnly && (g.isBattleRoyaleGameMode || g.isArenasGameMode || g.isControlGameMode)
        );
    }

    public static isMatchInGameModeSelection(
        match: MatchDataStore,
        gameModeList: MatchGameMode[],
        selectedGameModeList: MatchGameMode[]
    ): boolean {
        const isFilterSet = selectedGameModeList.length < gameModeList.length;
        const isFilterEmpty = !selectedGameModeList.length;
        const isGameModeEmpty = isEmpty(match.gameModeId);
        if (!isFilterSet || isFilterEmpty || isGameModeEmpty) return true;

        const matchGameMode = MatchGameMode.getFromId(gameModeList, match.gameModeId!);
        const foundGameMode = selectedGameModeList.find((gameMode) => gameMode.gameModeGenericId === matchGameMode.gameModeGenericId);
        return !!foundGameMode;
    }

    /** Uses map's generic ID to search match's mapID */
    public static isMatchInMapSelection(match: MatchDataStore, genericMapList: MatchMap[], selectedGenericMapList: MatchMap[]): boolean {
        const isFilterSet = selectedGenericMapList.length < genericMapList.length;
        const isFilterEmpty = !selectedGenericMapList.length;
        const isMapEmpty = isEmpty(match.mapId);
        if (!isFilterSet || isFilterEmpty || isMapEmpty) return true;

        const matchMap = MatchMap.getFromId(match.mapId ?? "", MatchMapList);
        if (!matchMap) return true;
        const foundMatchMap = selectedGenericMapList.find((map) => map.mapGenericId === matchMap.mapGenericId);
        return !!foundMatchMap;
    }

    public static isMatchInLegendSelection(match: MatchDataStore, legendList: Legend[], selectedLegendList: Legend[]): boolean {
        const isFilterSet = selectedLegendList.length < legendList.length;
        const isFilterEmpty = !selectedLegendList.length;
        const isLegendEmpty = isEmpty(match.legendId);
        if (!isFilterSet || isFilterEmpty || isLegendEmpty) return true;

        const foundLegend = selectedLegendList.find((legend) => legend.legendId === match.legendId);
        return !!foundLegend;
    }

    public static isMatchInSearchQuery(match: MatchDataStore, gameModeList: MatchGameMode[], searchQuery: string): boolean {
        searchQuery = searchQuery?.trim().toLowerCase() ?? "";
        if (isEmpty(searchQuery)) return true;
        const parsedSearch = this.parseSearchQuery(searchQuery);
        return (
            this.isSearchInMatchData(parsedSearch.searchQuery, match, gameModeList, parsedSearch.isExact) ||
            this.isSpecialSearchFound(parsedSearch.searchQuery, match, parsedSearch.isExact) ||
            this.isSearchInStats(parsedSearch.searchQuery, match)
        );
    }

    //#region Text Search
    /** Cleans search input by trimming whitespace. Checks for */
    private static parseSearchQuery(searchQuery: string): { searchQuery: string; isExact: boolean } {
        searchQuery = searchQuery.trim().toLowerCase().replace(" ", "");
        const isExact = searchQuery.substr(0, 1) === `"` && searchQuery.substr(searchQuery.length - 1, 1) === `"`;
        if (isExact) searchQuery = searchQuery.substring(1, searchQuery.length - 1);
        return { searchQuery: searchQuery, isExact };
    }

    private static isSearchStringFound(needle: string, haystack: string, isExact: boolean): boolean {
        haystack = haystack.trim().toLowerCase().replace(" ", "");
        if (isEmpty(needle) || isEmpty(haystack)) return false;
        return isExact ? haystack === needle : haystack.includes(needle);
    }

    /** Search using special keywords */
    private static isSpecialSearchFound(searchInput: string, match: MatchDataStore, isExact: boolean): boolean {
        if (searchInput === "win" || searchInput === "wins" || searchInput === "won") {
            return match.placement === 1;
        } else if (searchInput === "lose" || searchInput === "lost") {
            return match.placement !== 1;
        } else if (searchInput === "solo") {
            return match.teamRoster?.length === 1;
        } else if (match.gameModeId && searchInput === "control") {
            const gameMode = MatchGameMode.getFromId(MatchGameModeList, match.gameModeId);
            return gameMode.gameModeGenericId === MatchGameModeGenericId.Control;
        } else if (match.gameModeId && (searchInput === "arena" || searchInput === "arenas")) {
            const gameMode = MatchGameMode.getFromId(MatchGameModeList, match.gameModeId);
            return gameMode.gameModeGenericId === MatchGameModeGenericId.Arenas;
        } else if (match.gameModeId && (searchInput === "battleroyale" || searchInput === "battle royale")) {
            const gameMode = MatchGameMode.getFromId(MatchGameModeList, match.gameModeId);
            return (
                gameMode.gameModeGenericId === MatchGameModeGenericId.BattleRoyale_Duos ||
                gameMode.gameModeGenericId === MatchGameModeGenericId.BattleRoyale_Ranked ||
                gameMode.gameModeGenericId === MatchGameModeGenericId.BattleRoyale_Trios
            );
        }
        return false;
    }

    private static isSearchInStats(searchInput: string, match: MatchDataStore): boolean {
        if (isNaN(Number(searchInput))) return false;
        const numSearchInput = cleanInt(searchInput.replace(/[\D]+/g, ""));
        const foundInStats =
            (match.assists ?? 0) === numSearchInput ||
            (match.damage ?? 0) === numSearchInput ||
            (match.eliminations ?? 0) === numSearchInput ||
            (match.knockdowns ?? 0) === numSearchInput ||
            (match.placement ?? 0) === numSearchInput;
        return foundInStats;
    }

    private static isSearchInMatchData(
        searchInput: string,
        match: MatchDataStore,
        gameModeList: MatchGameMode[],
        isExact: boolean
    ): boolean {
        const getLegendNameFn = (legendId: string): Optional<string> => Legend.getName(legendId)?.toLowerCase();

        const matchMap = match.mapId ? MatchMap.getFromId(match.mapId, MatchMapList) : undefined;
        const gameMode = match.gameModeId ? MatchGameMode.getFromId(gameModeList, match.gameModeId) : undefined;

        const foundInMatchRoster = !!match.matchRoster?.find((mr) => this.isSearchStringFound(searchInput, mr.name, isExact));
        const foundInTeamRosterLegends = !!match.teamRoster?.find((tr) =>
            this.isSearchStringFound(searchInput, getLegendNameFn(tr.legendId) ?? "", isExact)
        );
        const foundInMapName = !!matchMap?.mapName && this.isSearchStringFound(searchInput, matchMap.mapName, isExact);
        const foundInMyName = !!match.myName && this.isSearchStringFound(searchInput, match.myName, isExact);
        const foundInMyLegendName =
            !!match.legendId && this.isSearchStringFound(searchInput, new Legend(match.legendId).name ?? "", isExact);
        const foundInGameMode = !!gameMode?.gameModeName && this.isSearchStringFound(searchInput, gameMode.gameModeName, isExact);

        return foundInMatchRoster || foundInTeamRosterLegends || foundInMapName || foundInMyName || foundInMyLegendName || foundInGameMode;
    }
    //#endregion
}

/**
 * @class MatchFilters
 * @classdesc Intakes a match list and filters it based on the given filters.
 * @constructor Creates a new MatchFilters instance.
 * @param {MatchDataStore[]} matchList - The list of matches to apply filters against.
 * @param {MatchMap[]} mapList - The list of available maps to filter by. Defaults to all generic maps.
 * @param {MatchGameMode[]} gameModeList - The list of available game modes to filter by. Defaults to non-training game modes.
 * @param {Legend[]} legendList - The list of available legends to filter by. Defaults to all legends.
 */
export class MatchFilters extends StaticMatchFilters {
    /** Filtered out match list (after filters are applied) */
    public filteredMatchList: MatchDataStore[] = [];

    /** List of all available maps to filter from. */
    public matchList: MatchDataStore[];
    /** Gets a list of all available maps to filter from; defaults to generic non-training maps */
    public readonly mapList: MatchMap[];
    /** Gets a list of all available game modes to filter from; defaults to non-training and non-firing range game modes. */
    public readonly gameModeList: MatchGameMode[];
    /** Gets a list of all available legends to filter from; defaults to all legends. */
    public readonly legendList: Legend[];

    /** Maps selected from the user */
    public selectedMapList: MatchMap[] = [];
    /** Game modes selected from the user */
    public selectedGameModeList: MatchGameMode[] = [];
    /** Legends selected from the user */
    public selectedLegendList: Legend[] = [];
    /** Search string entered by the user */
    public searchQuery = "";

    // Options
    private afSupportedOnlyGameModes = true;
    private chartableMapsOnly = true;
    private sortMapList = true;
    private sortGameModeList = true;
    private sortLegendList = true;

    constructor(
        matchList?: MatchDataStore[],
        mapList?: MatchMap[],
        gameModeList?: MatchGameMode[],
        legendList?: Legend[],
        options?: {
            afSupportedOnlyGameModes?: boolean;
            chartableMapsOnly?: boolean;
            sortMapList?: boolean;
            sortGameModeList?: boolean;
            sortLegendList?: boolean;
        }
    ) {
        super();
        if (options) {
            if (!isEmpty(options.afSupportedOnlyGameModes)) this.afSupportedOnlyGameModes = options.afSupportedOnlyGameModes!;
            if (!isEmpty(options.chartableMapsOnly)) this.chartableMapsOnly = options.chartableMapsOnly!;
            if (!isEmpty(options.sortMapList)) this.sortMapList = options.sortMapList!;
            if (!isEmpty(options.sortGameModeList)) this.sortGameModeList = options.sortGameModeList!;
            if (!isEmpty(options.sortLegendList)) this.sortLegendList = options.sortLegendList!;
        }

        this.matchList = matchList ?? [];
        this.mapList = mapList ?? MatchFilters.getGenericMapList();
        this.gameModeList = gameModeList ?? MatchFilters.getNonTrainingGameModeList(this.afSupportedOnlyGameModes);
        this.legendList = legendList ?? LegendList;

        if (this.chartableMapsOnly) this.mapList = this.mapList.filter((map) => map.isChartable);

        // Selected
        this.selectedMapList = this.mapList;
        this.selectedGameModeList = this.gameModeList;
        this.selectedLegendList = this.legendList;

        // Sorting
        if (this.sortMapList) this.mapList = sortMatchMapList(this.mapList);
        if (this.sortGameModeList) this.gameModeList = sortMatchGameModeList(this.gameModeList);
        if (this.sortLegendList) this.legendList = sortLegendList(this.legendList);
    }

    public applyFilters(): void {
        this.filteredMatchList = this.matchList.filter((match) => {
            return (
                MatchFilters.isMatchInGameModeSelection(match, this.gameModeList, this.selectedGameModeList) &&
                MatchFilters.isMatchInMapSelection(match, this.mapList, this.selectedMapList) &&
                MatchFilters.isMatchInLegendSelection(match, this.legendList, this.selectedLegendList) &&
                MatchFilters.isMatchInSearchQuery(match, this.gameModeList, this.searchQuery)
            );
        });
    }
}
