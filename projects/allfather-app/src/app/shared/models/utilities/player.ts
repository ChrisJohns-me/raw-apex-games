import { isEmpty } from "shared/utilities";

/**
 * Get valid clan tag from player's name.
 * This is only a string parser; does not validate that the player is legitimately in the club.
 * @returns {{ clubTag: string, playerName: string }} Provides object of clubTag and playerName.
 *  - if club is not found, returns empty clubTag with player's original name.
 */
export function getPlayerNameClubParts(playerName: string): { clubTag: string; playerName: string } {
    const clubRegEx = /^\[(\w{3,4})\]\s?(.*)$/;
    const matches = playerName.match(clubRegEx);
    if (matches && matches.length >= 2) return { clubTag: matches[1], playerName: matches[2] };
    return { clubTag: "", playerName };
}

/**
 * Recommended approach for searching for a player from within in-game events, such as "attackerName", or "victimName".
 * Helps to find a player who may have a club name.
 * @returns {false} if empty
 */
export function isPlayerNameEqual(playerNameLeft?: string, playerNameRight?: string): boolean {
    if (isEmpty(playerNameLeft) || isEmpty(playerNameRight)) return false;

    const maybeClubPlayerNameLeft = getPlayerNameClubParts(playerNameLeft!).playerName;
    const maybeClubPlayerNameRight = getPlayerNameClubParts(playerNameRight!).playerName;
    return (
        playerNameLeft === playerNameRight ||
        playerNameLeft === maybeClubPlayerNameRight ||
        maybeClubPlayerNameLeft === playerNameRight ||
        maybeClubPlayerNameLeft === maybeClubPlayerNameRight
    );
}
