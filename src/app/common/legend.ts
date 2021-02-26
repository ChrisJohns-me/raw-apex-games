/**
 * Extracts a legend's name from in-game value.
 * @param keyName "#character_bangalore_NAME"
 * @returns "bangalore"
 */
export function getFriendlyLegendName(keyName?: string): string {
    if (!keyName) return "";
    const prefix = "#character_";
    const suffix = "_NAME";
    const regEx = new RegExp(prefix + "(.+?)" + suffix);
    const matches = keyName.match(regEx);
    const legendName = matches?.[1];
    return legendName ?? "";
}
