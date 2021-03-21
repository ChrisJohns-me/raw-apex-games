import { Player, PlayerStatus } from "./player";
import { Team, TeamStatus } from "./team";

export class MatchRoster {
    /**
     * Shares same limitations to `alivePlayers`
     * */
    public get aliveTeams(): Team[] {
        return this.teams.filter((t) => t.status === TeamStatus.Alive);
    }
    /** Shares same limitations and is opposite to `aliveTeams` */
    public get eliminatedTeams(): Team[] {
        return this.teams.filter((t) => t.status === TeamStatus.Eliminated);
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
        return ([] as Player[]).concat(...this.teams.map((t) => t.members));
    }

    constructor(public teams: Team[] = []) {}

    //#region Player Actions
    public respawnPlayer(player: Player): void {
        this.updateRosterPlayerStatus(player, PlayerStatus.Alive);
    }

    public knockdownPlayer(victim: Player): void {
        this.updateRosterPlayerStatus(victim, PlayerStatus.Knocked);
    }

    public eliminatePlayer(victim: Player): void {
        this.updateRosterPlayerStatus(victim, PlayerStatus.Eliminated);
    }
    //#endregion

    //#region Team Actions
    public eliminateTeam(team: Team): void {
        this.teams.forEach((t) => {
            if (t.teamId !== team.teamId) return;
            t.members.forEach((member) => this.eliminatePlayer(member));
            t.setTeamStatus(TeamStatus.Eliminated);
        });
    }
    //#endregion

    private updateRosterPlayerStatus(rosterPlayer: Player, status: PlayerStatus): void {
        this.players.forEach((player) => {
            if (!player || player !== rosterPlayer) return;
            player.status = status;
        });
    }
}
