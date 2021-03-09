import { MapCoordinates } from "./game";

/**
 * Extracts map's name from key value.
 * @param keyName "kings_canyon"
 * @returns "kings canyon"
 */
export function getFriendlyMapName(mapName?: string): string {
    if (!mapName) return "";
    let newMapName = mapName.toLowerCase();
    newMapName = newMapName.replace(/_/g, " ");
    return newMapName ?? "";
}

// TODO: Refactor to pull this data from the remote API.
export enum GameMapName {
    KingsCanyon = "kings_canyon",
    WorldsEdge = "worlds_edge",
    Olympus = "olympus",
}

export interface GameMap {
    name: GameMapName;
    layoutId: string; // Useful to reference map image
    activeDates?: Array<{
        // Useful to also cross-reference with the current date
        from: Date;
        to?: Date; // if undefined, map is currently active
    }>;
    dropshipStartingZ: MapCoordinates["z"]; // Useful to cross-reference with starting location
}

export const GameMaps: GameMap[] = [
    {
        name: GameMapName.KingsCanyon,
        layoutId: "MU2_REV1",
        activeDates: [
            {
                from: new Date("June 23, 2020"),
            },
        ],
        dropshipStartingZ: 234,
    },
    {
        name: GameMapName.WorldsEdge,
        layoutId: "MU1_REV1",
        activeDates: [
            {
                from: new Date("April 07, 2020"),
                to: new Date("February 1, 2021"),
            },
        ],
        dropshipStartingZ: -Infinity, // Unknown
    },
    {
        name: GameMapName.Olympus,
        layoutId: "REV1",
        activeDates: [
            {
                from: new Date("January 05, 2021"),
            },
        ],
        dropshipStartingZ: 119,
    },
];
