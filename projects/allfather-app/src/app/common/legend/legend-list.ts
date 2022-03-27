import { isEmpty, mathClamp } from "common/utilities/";
import { hexToRgb, hslToHex, rgbToHsl } from "common/utilities/color";
import { Legend } from "./legend";

export const LegendList: Legend[] = [
    new Legend("#character_ash_NAME"),
    new Legend("#character_bangalore_NAME"),
    new Legend("#character_bloodhound_NAME"),
    new Legend("#character_caustic_NAME"),
    new Legend("#character_crypto_NAME"),
    new Legend("#character_fuse_NAME"),
    new Legend("#character_gibraltar_NAME"),
    new Legend("#character_horizon_NAME"),
    new Legend("#character_lifeline_NAME"),
    new Legend("#character_loba_NAME"),
    new Legend("#character_madmaggie_NAME"),
    new Legend("#character_mirage_NAME"),
    new Legend("#character_octane_NAME"),
    new Legend("#character_pathfinder_NAME"),
    new Legend("#character_rampart_NAME"),
    new Legend("#character_revenant_NAME"),
    new Legend("#character_seer_NAME"),
    new Legend("#character_valkyrie_NAME"),
    new Legend("#character_wattson_NAME"),
    new Legend("#character_wraith_NAME"),
];

/**
 * @returns RGB color of a legend's ID
 */
export function getLegendBGColor(legendId?: string): string {
    const defaultColor = "#b32831";
    if (isEmpty(legendId)) return defaultColor;
    const legendColors = [
        { legendId: "#character_ash_NAME", rgbColor: "#248996" },
        { legendId: "#character_bangalore_NAME", rgbColor: "#ac3a30" },
        { legendId: "#character_bloodhound_NAME", rgbColor: "#b63932" },
        { legendId: "#character_caustic_NAME", rgbColor: "#d8bb80" },
        { legendId: "#character_crypto_NAME", rgbColor: "#63558b" },
        { legendId: "#character_fuse_NAME", rgbColor: "#ec9e4c" },
        { legendId: "#character_gibraltar_NAME", rgbColor: "#b36f45" },
        { legendId: "#character_horizon_NAME", rgbColor: "#416ac1" },
        { legendId: "#character_lifeline_NAME", rgbColor: "#ab73bb" },
        { legendId: "#character_loba_NAME", rgbColor: "#deb760" },
        { legendId: "#character_madmaggie_NAME", rgbColor: "#e8e65a" },
        { legendId: "#character_mirage_NAME", rgbColor: "#ba8940" },
        { legendId: "#character_octane_NAME", rgbColor: "#7fb662" },
        { legendId: "#character_pathfinder_NAME", rgbColor: "#83d3f0" },
        { legendId: "#character_rampart_NAME", rgbColor: "#c34696" },
        { legendId: "#character_revenant_NAME", rgbColor: "#c1c184" },
        { legendId: "#character_seer_NAME", rgbColor: "#40a0c6" },
        { legendId: "#character_valkyrie_NAME", rgbColor: "#8362a7" },
        { legendId: "#character_wattson_NAME", rgbColor: "#1b4ba7" },
        { legendId: "#character_wraith_NAME", rgbColor: "#8c62f2" },
    ];
    const foundColor = legendColors.find((c) => c.legendId.toLowerCase() === legendId!.toLowerCase())?.rgbColor;
    return foundColor ?? defaultColor;
}

/**
 * CSS background gradient of the Legend's icon
 * @returns "linear-gradient(45deg, #xxxxxx, #xxxxxx)"
 */
export function generateLegendBGLinearColor(legendId?: string): string {
    const primaryColor = getLegendBGColor(legendId);
    const secondaryColorHSL = rgbToHsl(...hexToRgb(primaryColor));
    secondaryColorHSL[1] = mathClamp(secondaryColorHSL[1] + 0.1, 0, 1);
    secondaryColorHSL[2] = mathClamp(secondaryColorHSL[2] / 2, 0, 1);
    const secondaryColor = hslToHex(...secondaryColorHSL);
    return `linear-gradient(45deg, ${primaryColor}, #${secondaryColor})`;
}

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
