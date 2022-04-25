import { MatchGameModeGenericId } from "../game-mode/game-mode.enum";
import { MatchMapCoordinates } from "./map-coordinates";
import { MatchMapFriendlyName, MatchMapGenericId } from "./map.enum";

type ActiveDates = Array<{
    // Empty ([]) = Inactive
    from: Date; // Useful to also cross-reference with the current date
    to?: Date; // if undefined, map is currently active
}>;

interface MatchMapChartingConfig {
    imageAxisScale: {
        xStart: number;
        xEnd: number;
        yStart: number;
        yEnd: number;
    };
}

interface MatchMapConstructor {
    mapId: string;
    mapGenericId: MatchMapGenericId;
    mapName: MatchMapFriendlyName;
    isBattleRoyaleMap: boolean;
    isArenasMap: boolean;
    isControlMap: boolean;
    gameModeTypes?: MatchGameModeGenericId[];
    activeDates?: ActiveDates;
    zStartPos?: MatchMapCoordinates["z"];
    isChartable?: boolean;
    chartConfig?: MatchMapChartingConfig;
}
export class MatchMap implements MatchMapConstructor {
    public mapId: string;
    public mapGenericId: MatchMapGenericId;
    public mapName: MatchMapFriendlyName;
    public isBattleRoyaleMap: boolean;
    public isArenasMap: boolean;
    public isControlMap: boolean;
    public gameModeTypes?: MatchGameModeGenericId[];
    public activeDates?: ActiveDates;
    public zStartPos?: MatchMapCoordinates["z"]; // Useful to cross-reference with starting location
    public isChartable?: boolean;
    public chartConfig?: MatchMapChartingConfig;

    public get layoutFilename(): string {
        return MatchMap.getLayoutFilename(this.mapId);
    }
    public get previewFilename(): string {
        return MatchMap.getPreviewFilename(this.mapGenericId);
    }

    public static unknownLayoutId = "unknown_map_layout";
    public static unknownPreviewId = "unknown_map_preview";

    public get isActive(): boolean {
        const now = new Date();
        return !!this.activeDates?.some((date) => date.from <= now && (!date.to || now <= date.to));
    }

    constructor(ctor: MatchMapConstructor) {
        this.mapId = ctor.mapId;
        this.mapGenericId = ctor.mapGenericId;
        this.mapName = ctor.mapName;
        this.isBattleRoyaleMap = ctor.isBattleRoyaleMap;
        this.isArenasMap = ctor.isArenasMap;
        this.isControlMap = ctor.isControlMap;
        this.gameModeTypes = ctor.gameModeTypes;
        this.activeDates = ctor.activeDates;
        this.zStartPos = ctor.zStartPos;
        this.isChartable = ctor.isChartable ?? true;
        this.chartConfig = ctor.chartConfig;
    }

    //#region Static Methods
    public static getFromId(mapId: string, matchMapList: MatchMap[]): Optional<MatchMap> {
        const idCleanFn = (id: string): string => id.toLowerCase().replace(/[_\W]+/gi, "");
        const foundMatchMap = matchMapList.find((matchMap) => idCleanFn(matchMap.mapId) === idCleanFn(mapId));
        return foundMatchMap;
    }

    /** @returns The latest MatchMap from the list, based on the friendly name */
    public static getFromFriendlyName(
        friendlyName: string,
        matchMapList: MatchMap[],
        gameModeBaseType?: MatchGameModeGenericId
    ): Optional<MatchMap> {
        const mapList = gameModeBaseType
            ? matchMapList.filter((matchMap) => matchMap.gameModeTypes?.find((gameMode) => gameMode === gameModeBaseType))
            : matchMapList;
        if (!mapList || !mapList.length) return undefined;

        const nameCleanFn = (name: string): string => {
            return name.toLowerCase().replace(/[^a-z]/gi, "");
        };

        const foundSimilarMap = mapList.find((matchMap) => nameCleanFn(matchMap.mapGenericId) === nameCleanFn(friendlyName));
        return foundSimilarMap ? MatchMap.latestGenericMap(foundSimilarMap?.mapGenericId, matchMapList) : undefined;
    }

    /**
     * Removes duplicate Maps from the provided Map List
     * @returns latest map based on the GenericId
     */
    public static latestGenericMap(genericId: MatchMapGenericId, matchMapList: MatchMap[]): Optional<MatchMap> {
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
            return activeDates.slice().sort(activeDatesSortFn)[0];
        };

        let latestMap: Optional<MatchMap>;
        matchMapList
            .slice()
            .sort((a, b) => {
                // Sort Descending
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

    /**
     * @returns Filename of map's topographical image.
     * @returns Defaults to unknown image, if map's id is empty.
     */
    public static getLayoutFilename(mapId?: string): string {
        return MatchMap.generateFilename(mapId ?? MatchMap.unknownLayoutId, "", "", "webp");
    }

    /**
     * @returns Filename of map's preview image.
     * @returns Defaults to unknown image, if map's id is empty.
     */
    public static getPreviewFilename(genericId?: MatchMapGenericId): string {
        return MatchMap.generateFilename(genericId ?? MatchMap.unknownPreviewId, "", "", "webp");
    }

    private static generateFilename = (value: string, prefix = "", suffix = "", extension = "webp"): string =>
        `${prefix}${value}${suffix}.${extension}`;
    //#endregion
}
