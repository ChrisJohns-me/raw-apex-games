import { wordsToUpperCase } from "src/utilities/string";

type ActiveDates = Array<{
    from: Date; // Useful to also cross-reference with the current date
    to?: Date; // if undefined, map is currently active
}>;

export interface MapCoordinates {
    x: number;
    y: number;
    z: number;
}

// TODO: Refactor to pull this data from the remote API.
export enum GameMapId {
    KingsCanyon = "kings_canyon",
    WorldsEdge = "worlds_edge",
    Olympus = "olympus",
}

export class GameMap {
    public id?: GameMapId;
    public layoutId?: string; // Useful to reference map image
    public activeDates?: ActiveDates;
    public dropshipZStart?: MapCoordinates["z"]; // Useful to cross-reference with starting location

    public get friendlyName(): string {
        return this.id ? this.getFriendlyName(this.id) : "";
    }

    public get isActive(): boolean {
        return !!this.activeDates?.some((date) => date.to == null && date.from < new Date());
    }

    constructor(
        id: GameMapId,
        init?: { layoutId?: string; activeDates?: ActiveDates; dropshipZStart?: MapCoordinates["z"] }
    ) {
        this.id = id;
        this.layoutId = init?.layoutId;
        this.activeDates = init?.activeDates;
        this.dropshipZStart = init?.dropshipZStart;
    }

    /**
     * @param keyName "kings_canyon"
     * @returns "Kings Canyon"
     */
    private getFriendlyName(mapId: GameMapId | string): string {
        if (!mapId) return "";
        let newMapName = mapId.toLowerCase();
        newMapName = newMapName.replace(/_/g, " ");
        newMapName = wordsToUpperCase(newMapName);
        return newMapName ?? "";
    }
}
