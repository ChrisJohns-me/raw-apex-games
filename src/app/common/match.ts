export enum MatchState {
    Active = "active",
    Inactive = "inactive",
}

export interface MatchStateChangeEvent {
    startDate?: Date;
    endDate?: Date;
    state: MatchState;
}

export interface GameMode {
    id: string;
    friendlyName: string;
}

/**
 * Extracts a game mode's friendly name from in-game value.
 * @param name "#PL_TRIO"
 * @returns "trio"
 */
export function getFriendlyGameModeName(gameMode?: GameMode["id"]): GameMode["friendlyName"] {
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
