import { isPlayerNameEqual } from "../utilities/player";
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
        if (alreadyExistingPlayer) {
            console.warn(`"${newPlayer.name}" already exists in the roster, overwriting.`, newPlayer, this.teams);
            this.removePlayerName(newPlayer.name);
        }

        const foundTeam = this.teams.find((t) => !!t.teamId && t.teamId === newPlayer.teamId);
        if (foundTeam) foundTeam.members.push(newPlayer);
        else {
            const newTeam: MatchRosterTeam<T> = {
                teamId: newPlayer.teamId!,
                members: [newPlayer],
            };
            this.teams.push(newTeam);
        }
        this.removeEmptyTeams();
    }

    public removePlayerName(playerName: string): void {
        const foundPlayer = this.allPlayers.find((p) => isPlayerNameEqual(p.name, playerName));
        if (!foundPlayer)
            return void console.debug(`Attempted to remove "${playerName}" from roster, but was not found.`, playerName, this.teams);

        this.teams = this.teams.map((team) => {
            return { ...team, members: team.members.filter((p) => !isPlayerNameEqual(p.name, playerName)) };
        });
        this.removeEmptyTeams();
    }

    public removeTeam(teamId: MatchRosterTeam["teamId"]): void {
        this.teams = this.teams.filter((team) => team.teamId === teamId);
    }

    private removeEmptyTeams(): void {
        this.teams = this.teams.filter((team) => team.members && team.members.length);
    }
}
