import { MatchRosterPlayer } from "./match-roster-player";
import { MatchRosterTeam } from "./match-roster-team";

export class MatchRoster {
    public teams: MatchRosterTeam[] = [];
    public get allPlayers(): MatchRosterPlayer[] {
        return ([] as MatchRosterPlayer[]).concat(...this.teams.map((t) => t.members));
    }

    /**
     * Append a new player to it's respective team via `teamId`
     */
    public addPlayer(newPlayer: MatchRosterPlayer): void {
        const alreadyExistingPlayer = this.allPlayers.find((p) => p.name === newPlayer.name);
        if (alreadyExistingPlayer)
            return void console.error(
                `"${newPlayer.name}" already exists in the match roster, skipping.`,
                newPlayer,
                this.teams
            );

        const foundTeam = this.teams.find((t) => t.teamId === newPlayer.teamId);
        if (foundTeam) foundTeam.members.push(newPlayer);
        else {
            const newTeam: MatchRosterTeam = {
                teamId: newPlayer.teamId,
                members: [newPlayer],
            };
            this.teams.push(newTeam);
        }
    }

    /**
     * Recommended approach for searching for a player from within in-game events, such as "attackerName", or "victimName".
     * Helps to find a player who may have a club name.
     */
    public findPlayer(playerName: string): Optional<MatchRosterPlayer> {
        const possibleClubPlayerName = this.getPlayerNameClubParts(playerName)[1];
        const foundPlayer = this.allPlayers.find((p) => p.name === possibleClubPlayerName || p.name === playerName);
        if (foundPlayer) return foundPlayer;
        return undefined;
    }

    /**
     * Get valid clan tag from player's name.
     * This is only a string parser; does not validate that the player is legitimately in the club.
     * @returns {[clubTag: string, playerName: string]} Provides tuple of clubTag and playerName.
     *  - if club is not found, returns empty clubTag with player's original name.
     */
    public getPlayerNameClubParts(playerName: string): [clubTag: string, playerName: string] {
        const clubRegEx = /^\[(\w{3,4})\]\s?(.*)$/;
        const matches = playerName.match(clubRegEx);
        if (matches) return [matches[1], matches[2]];
        return ["", playerName];
    }
}
