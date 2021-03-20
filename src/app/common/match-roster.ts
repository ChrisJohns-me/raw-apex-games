import { Player, PlayerStatus } from "./player";
import { Team, TeamStatus } from "./team";

export class MatchRoster {
    public get teams(): Team[] {
        return this._teams;
    }
    /**
     * Shares same limitations to `alivePlayers`
     * */
    public get aliveTeams(): Team[] {
        return this._teams.filter((t) => t.status === TeamStatus.Alive);
    }
    /** Shares same limitations and is opposite to `aliveTeams` */
    public get eliminatedTeams(): Team[] {
        return this._teams.filter((t) => t.status === TeamStatus.Eliminated);
    }
    /**
     * Accounts for:
     *  - Players that have not been eliminated.
     *  - Disconnected/Quit players
     * Does not account for:
     *  - Player respawns
     *  - Eliminated players who are still spectating
     */
    public get alivePlayers(): Player[] {
        return this.players.filter((p) => p.status === PlayerStatus.Alive);
    }
    /** Shares same limitations to and is opposite to `alivePlayers` */
    public get eliminatedPlayers(): Player[] {
        return this.players.filter((p) => p.status === PlayerStatus.Eliminated);
    }
    public get players(): Player[] {
        return ([] as Player[]).concat(...this._teams.map((t) => t.members));
    }

    constructor(private _teams: Team[] = []) {}

    //#region Player Actions
    public respawnPlayer(playerName: string): void {
        this.updateRosterPlayerStatus(playerName, PlayerStatus.Alive);
    }

    public knockdownPlayer(victimName: string): void {
        this.updateRosterPlayerStatus(victimName, PlayerStatus.Knocked);
    }

    public eliminatePlayer(victimName: string): void {
        this.updateRosterPlayerStatus(victimName, PlayerStatus.Eliminated);
    }
    //#endregion

    //#region Team Actions
    public eliminateTeam(teamId: number): void {
        if (!isFinite(teamId)) return;
        this._teams.forEach((t) => {
            if (t.teamId !== teamId) return;
            t.members.forEach((m) => this.eliminatePlayer(m.name));
            t.setTeamStatus(TeamStatus.Eliminated);
        });
    }
    //#endregion

    private updateRosterPlayerStatus(playerName: string, status: PlayerStatus): void {
        if (!playerName) return;
        this.players.forEach((player) => {
            if (player.name !== playerName) return;
            player.setStatus(status);
        });
    }
}
