import { isEmpty } from "src/utilities";

/**
 * Get valid clan tag from player's name.
 * This is only a string parser; does not validate that the player is legitimately in the club.
 * @returns {[clubTag: string, playerName: string]} Provides tuple of clubTag and playerName.
 *  - if club is not found, returns empty clubTag with player's original name.
 */
export function getPlayerNameClubParts(playerName: string): [clubTag: string, playerName: string] {
    const clubRegEx = /^\[(\w{3,4})\]\s?(.*)$/;
    const matches = playerName.match(clubRegEx);
    if (matches && matches.length >= 2) return [matches[1], matches[2]];
    return ["", playerName];
}

/**
 * Recommended approach for searching for a player from within in-game events, such as "attackerName", or "victimName".
 * Helps to find a player who may have a club name.
 */
export function isPlayerNameEqual(playerNameLeft?: string, playerNameRight?: string): boolean {
    if (isEmpty(playerNameLeft) || isEmpty(playerNameRight)) return false;

    const maybeClubPlayerNameLeft = getPlayerNameClubParts(playerNameLeft!)[1];
    const maybeClubPlayerNameRight = getPlayerNameClubParts(playerNameRight!)[1];
    return (
        playerNameLeft === playerNameRight ||
        playerNameLeft === maybeClubPlayerNameRight ||
        maybeClubPlayerNameLeft === playerNameRight ||
        maybeClubPlayerNameLeft === maybeClubPlayerNameRight
    );
}
