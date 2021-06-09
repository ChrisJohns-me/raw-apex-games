import { Legend } from "./legend";

export const LegendList: Legend[] = [
    new Legend("#character_bloodhound_NAME"),
    new Legend("#character_gibraltar_NAME"),
    new Legend("#character_lifeline_NAME"),
    new Legend("#character_pathfinder_NAME"),
    new Legend("#character_wraith_NAME"),
    new Legend("#character_bangalore_NAME"),
    new Legend("#character_caustic_NAME"),
    new Legend("#character_mirage_NAME"),
    new Legend("#character_octane_NAME"),
    new Legend("#character_wattson_NAME"),
    new Legend("#character_crypto_NAME"),
    new Legend("#character_revenant_NAME"),
    new Legend("#character_loba_NAME"),
    new Legend("#character_rampart_NAME"),
    new Legend("#character_horizon_NAME"),
    new Legend("#character_fuse_NAME"),
    new Legend("#character_valkyrie_NAME"),
];

/**
 * Sorts by:
 *  - Alphabetically
 */
export function sortLegendList(legendList: Legend[]): Legend[] {
    return legendList.sort((a, b) => {
        if ((a.name?.toLowerCase() ?? "") < (b.name?.toLowerCase() ?? "")) return -1;
        if ((a.name?.toLowerCase() ?? "") > (b.name?.toLowerCase() ?? "")) return 1;
        return 0;
    });
}
