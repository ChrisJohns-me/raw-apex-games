import { wordsToUpperCase } from "shared/utilities/string";
import { MatchMapCoordinates } from "./match-map-coordinates";

type ActiveDates = Array<{
    from: Date; // Useful to also cross-reference with the current date
    to?: Date; // if undefined, map is currently active
}>;

// TODO: Refactor to pull this data from the remote API.
export enum MatchMapId {
    KingsCanyon = "kings_canyon",
    WorldsEdge = "worlds_edge",
    Olympus = "olympus",
}

type MatchMapConstructor = {
    id: string;
    layoutId?: string;
    activeDates?: ActiveDates;
    dropshipZStart?: MatchMapCoordinates["z"];
};

export class MatchMap {
    public id: string;
    public layoutId?: string; // Useful to reference map image
    public activeDates?: ActiveDates;
    public dropshipZStart?: MatchMapCoordinates["z"]; // Useful to cross-reference with starting location
    /**
     * @param keyName "kings_canyon"
     * @returns "Kings Canyon"
     */
    public get friendlyName(): string {
        if (!this.id) return "";
        let newMapName = this.id.toLowerCase();
        newMapName = newMapName.replace(/_/g, " ");
        newMapName = wordsToUpperCase(newMapName);
        return newMapName ?? "";
    }

    public get isActive(): boolean {
        return !!this.activeDates?.some((date) => date.to == null && date.from < new Date());
    }

    constructor(ctor: MatchMapConstructor) {
        this.id = ctor.id;
        this.layoutId = ctor.layoutId;
        this.activeDates = ctor.activeDates;
        this.dropshipZStart = ctor.dropshipZStart;
    }
}
