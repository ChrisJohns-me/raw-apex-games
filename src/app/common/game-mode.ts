/**
 * Extracts a game mode's friendly name from in-game value.
 * @param keyName "#PL_TRIO"
 * @returns "trio"
 */
export function getFriendlyGameMode(gameMode?: string): string {
    if (!gameMode) return "";
    let newGameMode = gameMode.toLowerCase();
    newGameMode = newGameMode.replace(/#pl/g, "");
    newGameMode = newGameMode.replace(/mode/g, "");
    newGameMode = newGameMode.replace(/leagues/g, "");
    newGameMode = newGameMode.replace(/ltm/g, "");
    newGameMode = newGameMode.replace(/_/g, " ");
    newGameMode = newGameMode.replace(/ {2}/g, " ");
    newGameMode = newGameMode.trim();
    return newGameMode ?? "";
}
