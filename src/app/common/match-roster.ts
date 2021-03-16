import { Player, PlayerStatus } from "./player";
import { Team, TeamStatus } from "./team";

export class MatchRoster {
    public get teams(): Team[] {
        return this._teams;
    }
    public get aliveTeams(): Team[] {
        return this._teams.filter((t) => t.status === TeamStatus.Alive);
    }
    public get eliminatedTeams(): Team[] {
        return this._teams.filter((t) => t.status === TeamStatus.Eliminated);
    }
    public get players(): Player[] {
        return ([] as Player[]).concat(...this._teams.map((t) => t.members));
    }

    private _teams: Team[] = [];

    constructor(teams: Team[]) {
        this._teams = teams;
    }

    //#region Player Actions
    public knockdownPlayer(victimName: string): void {
        this.updateRosterPlayerStatus(victimName, PlayerStatus.Knocked);
    }

    public eliminatePlayer(victimName: string): void {
        this.updateRosterPlayerStatus(victimName, PlayerStatus.Eliminated);
    }
    //#endregion

    //#region Team Actions
    public eliminateTeam(teamId: number): void {
        this._teams.forEach((t) => {
            if (t.teamId !== teamId) return;
            t.members.forEach((m) => this.eliminatePlayer(m.name));
            t.setTeamStatus(TeamStatus.Eliminated);
        });
    }
    //#endregion

    private updateRosterPlayerStatus(playerName: string, status: PlayerStatus): void {
        this.players.forEach((player) => {
            if (player.name !== playerName) return;
            player.setStatus(status);
        });
    }
}
