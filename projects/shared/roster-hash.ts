import md5 from "md5";

/**
 * @returns A hash string from a list of player names
 */
export function generateRosterHash(playerNames: string[]): string {
    return md5(playerNames.join(""));
}
