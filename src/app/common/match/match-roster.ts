import { isPlayerNameEqual } from "@common/utilities/player";
import { MatchRosterPlayer } from "./match-roster-player";
import { MatchRosterTeam } from "./match-roster-team";

export class MatchRoster<T extends MatchRosterPlayer = MatchRosterPlayer> {
    public teams: MatchRosterTeam<T>[] = [];
    public get allPlayers(): T[] {
        return ([] as T[]).concat(...this.teams.map((t) => t.members));
    }

    /**
     * Append a new player to it's respective team via `teamId`
     */
    public addPlayer(newPlayer: T): void {
        const alreadyExistingPlayer = this.allPlayers.find((p) => isPlayerNameEqual(p.name, newPlayer.name));
        if (alreadyExistingPlayer)
            return void console.error(`"${newPlayer.name}" already exists in the match roster, skipping.`, newPlayer, this.teams);

        const foundTeam = this.teams.find((t) => !!t.teamId && t.teamId === newPlayer.teamId);
        if (foundTeam) foundTeam.members.push(newPlayer);
        else {
            const newTeam: MatchRosterTeam<T> = {
                teamId: newPlayer.teamId!,
                members: [newPlayer],
            };
            this.teams.push(newTeam);
        }
    }
}
