import { isEmpty } from "common/utilities/";

/**
 * Get valid clantag from player's name.
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
    const sanitizeFn = (input: string): string => input.replace("`1", ""); // Overwolf quirk
    const simplifyFn = (input: string): string => input.toLowerCase().trim();
    const extremeSimplifyFn = (input: string): string => {
        return simplifyFn(input).replace(/[_\W+]/gi, "");
    };

    playerNameLeft = sanitizeFn(playerNameLeft!);
    playerNameRight = sanitizeFn(playerNameRight!);

    const clubPlayerNameLeft = getPlayerNameClubParts(playerNameLeft!).playerName;
    const clubPlayerNameRight = getPlayerNameClubParts(playerNameRight!).playerName;
    const clubSimpPlayerNameLeft = simplifyFn(clubPlayerNameLeft);
    const clubSimpPlayerNameRight = simplifyFn(clubPlayerNameRight);
    const clubExtSimpPlayerNameLeft = extremeSimplifyFn(clubPlayerNameLeft);
    const clubExtSimpPlayerNameRight = extremeSimplifyFn(clubPlayerNameRight);

    const simpPlayerNameLeft = simplifyFn(playerNameLeft!);
    const simpPlayerNameRight = simplifyFn(playerNameRight!);
    const extremeSimpPlayerNameLeft = extremeSimplifyFn(simpPlayerNameLeft);
    const extremeSimpPlayerNameRight = extremeSimplifyFn(simpPlayerNameRight);

    const playerNameLeftList = [
        playerNameLeft,
        clubPlayerNameLeft,
        clubSimpPlayerNameLeft,
        clubExtSimpPlayerNameLeft,
        simpPlayerNameLeft,
        extremeSimpPlayerNameLeft,
    ];
    const playerNameRightList = [
        playerNameRight,
        clubPlayerNameRight,
        clubSimpPlayerNameRight,
        clubExtSimpPlayerNameRight,
        simpPlayerNameRight,
        extremeSimpPlayerNameRight,
    ];

    return playerNameLeftList.some((left) => !!left && !!playerNameRightList?.includes(left));
}

/**
 * Returns a sanitized player name from the lowest common denominator of allowed characters, and character limits.
 *
 * Max character length:
 * - Xbox               12
 * - Origin             16
 * - PlayStation        16
 * - Nintendo Switch    30
 * - Steam              64 <-
 *
 * @todo Characters dis-allowed:
 * - Xbox               ~!@#$%^&*()_{}[].,/\`
 * - Origin
 * - PlayStation
 * - Nintendo Switch
 * - Steam
 */
export function sanitizePlayerName(playerName: string): string {
    return playerName.slice(0, 64);
}
