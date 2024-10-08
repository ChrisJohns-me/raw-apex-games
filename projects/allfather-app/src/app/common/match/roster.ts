import { isEmpty } from "common/utilities/";
import { isPlayerNameEqual } from "../utilities/player";
import { MatchRosterPlayer } from "./roster-player";
import { MatchRosterTeam } from "./roster-team";

export class MatchRoster<T extends MatchRosterPlayer = MatchRosterPlayer> {
    public teams: MatchRosterTeam<T>[] = [];
    public get allPlayers(): T[] {
        return ([] as T[]).concat(...this.teams.map((t) => t.members));
    }

    /**
     * Append a new player to it's respective team via `teamId`
     */
    public addPlayer(newPlayer: T): void {
        const playerExistsInRoster = this.allPlayers.some((p) => isPlayerNameEqual(p.name, newPlayer.name));
        if (playerExistsInRoster) {
            console.warn(`"${newPlayer.name}" already exists in the roster, overwriting.`, newPlayer, this.teams);
            this.removePlayer(newPlayer.name);
        }

        const foundTeam = this.teams.find((t) => !!t.teamId && t.teamId === newPlayer.teamId);
        if (foundTeam) foundTeam.members.push(newPlayer);
        else {
            if (isEmpty(newPlayer.teamId)) console.warn(`Received blank team ID for "${newPlayer.name}"`);
            const newTeam: MatchRosterTeam<T> = {
                teamId: newPlayer.teamId ?? -1,
                members: [newPlayer],
            };
            this.teams.push(newTeam);
        }
        this.removeEmptyTeams();
    }

    public removePlayer(playerName: string): void {
        const foundPlayer = this.allPlayers.find((p) => isPlayerNameEqual(p.name, playerName));
        if (!foundPlayer)
            return void console.warn(`Attempted to remove "${playerName}" from roster, but was not found.`, playerName, this.teams);

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
