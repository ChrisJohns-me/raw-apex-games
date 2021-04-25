import { MatchMapCoordinates } from "./map-coordinates";

type ActiveDates = Array<{
    from: Date; // Useful to also cross-reference with the current date
    to?: Date; // if undefined, map is currently active
}>;

interface MatchMapImageAxixScale {
    xStart: number;
    xEnd: number;
    yStart: number;
    yEnd: number;
}

export interface MatchMapConstructor {
    mapId: string;
    mapName: string;
    activeDates?: ActiveDates;
    dropshipZStart?: MatchMapCoordinates["z"];
    imageAxisScale?: MatchMapImageAxixScale;
}

export class MatchMap {
    public mapId: string;
    public mapName: string;
    public activeDates?: ActiveDates;
    public dropshipZStart?: MatchMapCoordinates["z"]; // Useful to cross-reference with starting location
    public imageAxisScale?: MatchMapImageAxixScale;

    public get isActive(): boolean {
        return !!this.activeDates?.some((date) => date.to == null && date.from < new Date());
    }

    constructor(ctor: MatchMapConstructor) {
        this.mapId = ctor.mapId;
        this.mapName = ctor.mapName;
        this.activeDates = ctor.activeDates;
        this.dropshipZStart = ctor.dropshipZStart;
        this.imageAxisScale = ctor.imageAxisScale;
    }
}
