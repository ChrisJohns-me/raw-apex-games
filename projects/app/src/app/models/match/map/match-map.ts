import { MatchGameModeGenericId } from "@app/models/match/game-mode/game-mode.enum.js";
import { MatchMapFriendlyName, MatchMapGenericId } from "./map.enum.js";

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
    gameModeTypes?: MatchGameModeGenericId[];
    isChartable?: boolean;
    /** FiringRange or Training map */
    isSandboxMap?: boolean;
    chartConfig?: MatchMapChartingConfig;
}
export class MatchMap implements MatchMapConstructor {
    public mapId: string;
    public mapGenericId: MatchMapGenericId;
    public mapName: MatchMapFriendlyName;
    public gameModeTypes?: MatchGameModeGenericId[];
    public isChartable?: boolean;
    public isSandboxMap?: boolean;
    public chartConfig?: MatchMapChartingConfig;

    public get layoutFilename(): string {
        return MatchMap.getLayoutFilename(this.mapId);
    }
    public get previewFilename(): string {
        return MatchMap.getPreviewFilename(this.mapGenericId);
    }

    public static unknownLayoutId = "unknown_map_layout";
    public static unknownPreviewId = "unknown_map_preview";

    constructor(ctor: MatchMapConstructor) {
        this.mapId = ctor.mapId;
        this.mapGenericId = ctor.mapGenericId;
        this.mapName = ctor.mapName;
        this.gameModeTypes = ctor.gameModeTypes;
        this.isChartable = ctor.isChartable ?? true;
        this.isSandboxMap = ctor.isSandboxMap ?? false;
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
     * @returns map based on the GenericId
     */
    public static latestGenericMap(genericId: MatchMapGenericId, matchMapList: MatchMap[]): Optional<MatchMap> {
        let latestMap: Optional<MatchMap>;
        matchMapList
            .slice()
            .sort((a, b) => {
                if (a.mapName < b.mapName) {
                    return -1;
                }
                if (a.mapName > b.mapName) {
                    return 1;
                }
                return 0;
            })
            .forEach((iterationMap) => {
                if (!iterationMap || iterationMap.mapGenericId !== genericId) return;
                if (!latestMap) {
                    latestMap = iterationMap;
                    return;
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
