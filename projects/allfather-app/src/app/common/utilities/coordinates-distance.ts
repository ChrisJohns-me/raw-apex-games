import { MatchMapCoordinates } from "../match/map/map-coordinates";

/** Multiplication conversion from ingame distance units, to ingame distance meters */
export const INGAME_UNITS_PER_METER = 2.5;

/**
 * @param {MatchMapCoordinates[]} coordinates An array of map coordinates.
 * @param {boolean} ignoreZ If true, the z-coordinates will be ignored.
 * @return {number} Total distance of the location history.
 */
export function coordinatesDistance(coordinates: MatchMapCoordinates[], ignoreZ = false): number {
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length <= 1) return 0;
    let totalDistanceUnits = 0;

    coordinates.reduce((prev, curr) => {
        if (!prev) return {} as MatchMapCoordinates;
        const a = prev.x - curr.x;
        const b = prev.y - curr.y;
        const c = !ignoreZ ? prev.z - curr.z : 0;

        const distance = Math.sqrt(a * a + b * b + c * c);
        totalDistanceUnits += distance;
        return curr;
    });

    return totalDistanceUnits;
}
