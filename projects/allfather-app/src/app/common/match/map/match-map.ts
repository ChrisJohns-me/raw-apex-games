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
        return !!this.activeDates?.some((date) => date.to == null && date.from < new Date());
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

        const foundMap = mapList.find((matchMap) => nameCleanFn(matchMap.mapGenericId) === nameCleanFn(friendlyName));
        return foundMap;
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
