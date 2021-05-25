import { MatchGameModeType } from "../game-mode";
import { MatchMapCoordinates } from "./map-coordinates";
import { MatchMapList } from "./map-list";
import { MatchMapFriendlyName, MatchMapGenericId } from "./map.enum";

type ActiveDates = Array<{
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

export interface MatchMapConstructor {
    mapId: string;
    genericId: MatchMapGenericId;
    mapName: MatchMapFriendlyName;
    gameModeTypes?: MatchGameModeType[];
    activeDates?: ActiveDates;
    dropshipZStart?: MatchMapCoordinates["z"];
    chartConfig?: MatchMapChartingConfig;
}

export class MatchMap implements MatchMapConstructor {
    public mapId: string;
    public genericId: MatchMapGenericId;
    public mapName: MatchMapFriendlyName;
    public gameModeTypes?: MatchGameModeType[];
    public activeDates?: ActiveDates;
    public dropshipZStart?: MatchMapCoordinates["z"]; // Useful to cross-reference with starting location
    public chartConfig?: MatchMapChartingConfig;

    public get isActive(): boolean {
        return !!this.activeDates?.some((date) => date.to == null && date.from < new Date());
    }

    constructor(ctor: MatchMapConstructor) {
        this.mapId = ctor.mapId;
        this.genericId = ctor.genericId;
        this.mapName = ctor.mapName;
        this.gameModeTypes = ctor.gameModeTypes;
        this.activeDates = ctor.activeDates;
        this.dropshipZStart = ctor.dropshipZStart;
        this.chartConfig = ctor.chartConfig;
    }
}

export function findMatchMapFromFriendlyName(friendlyName: string, gameModeBaseType?: MatchGameModeType): Optional<MatchMap> {
    const mapList = gameModeBaseType
        ? MatchMapList.filter((matchMap) => matchMap.gameModeTypes?.find((gameMode) => gameMode === gameModeBaseType))
        : MatchMapList;
    if (!mapList || !mapList.length) return undefined;

    const nameCleanFn = (name: string): string => {
        return name.toLowerCase().replace(/[^a-z]/gi, "");
    };

    const foundMap = mapList.find((matchMap) => nameCleanFn(matchMap.genericId) === nameCleanFn(friendlyName));
    return foundMap;
}
