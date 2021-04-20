export class MatchGameMode {
    constructor(public gameModeId?: string) {}

    /**
     * Extracts a game mode's friendly name from in-game value.
     * @param name "#PL_TRIO"
     * @returns "trio"
     */
    public get friendlyName(): string {
        if (!this.gameModeId) return "";
        let newGameMode = this.gameModeId.toLowerCase();
        newGameMode = newGameMode.replace(/#pl/g, "");
        newGameMode = newGameMode.replace(/mode/g, "");
        newGameMode = newGameMode.replace(/leagues/g, "");
        newGameMode = newGameMode.replace(/ltm/g, "");
        newGameMode = newGameMode.replace(/_/g, " ");
        newGameMode = newGameMode.replace(/ {2}/g, " ");
        newGameMode = newGameMode.trim();
        return newGameMode ?? "";
    }
}
