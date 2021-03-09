/**
 * Extracts a game mode's friendly name from in-game value.
 * @param keyName "#PL_Ranked_Leagues"
 * @returns "ranked leagues"
 */
export function getFriendlyGameMode(keyMode?: string): string {
    if (!keyMode) return "";
    const prefix = "#PL_";
    const regEx = new RegExp(prefix + "(.*)");
    const matches = keyMode.match(regEx);
    let gameMode = matches?.[1];
    gameMode = gameMode?.replace("_", " ").toLowerCase();
    return gameMode ?? "";
}
