import { MatchMapCoordinates } from "./map-coordinates";

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
    genericId: string;
    mapName: string;
    activeDates?: ActiveDates;
    dropshipZStart?: MatchMapCoordinates["z"];
    chartConfig?: MatchMapChartingConfig;
}

export class MatchMap {
    public mapId: string;
    public genericId: string;
    public mapName: string;
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
        this.activeDates = ctor.activeDates;
        this.dropshipZStart = ctor.dropshipZStart;
        this.chartConfig = ctor.chartConfig;
    }
}
