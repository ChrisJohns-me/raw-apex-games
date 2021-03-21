import { Player, PlayerStatus, PlayerStatus as TeamStatus } from "./player";

export { TeamStatus };

type TeamConstructor = {
    teamId: number;
    isMyTeam?: boolean;
    members?: Player[];
};

export class Team {
    public teamId: number;
    public isMyTeam: boolean;
    public members: Player[];
    public get status(): TeamStatus {
        if (this.members.some((m) => m.status === PlayerStatus.Alive)) return PlayerStatus.Alive;
        else if (this.members.every((m) => m.status === PlayerStatus.Eliminated)) return PlayerStatus.Eliminated;
        else return PlayerStatus.Alive;
    }
    public get aliveMembers(): Player[] {
        return this.members.filter((m) => m.status === PlayerStatus.Alive);
    }
    public get knockedMembers(): Player[] {
        return this.members.filter((m) => m.status === PlayerStatus.Knocked);
    }
    public get eliminatedMembers(): Player[] {
        return this.members.filter((m) => m.status === PlayerStatus.Eliminated);
    }

    constructor(ctor: TeamConstructor) {
        this.teamId = ctor.teamId;
        this.isMyTeam = ctor.isMyTeam ?? false;
        this.members = !!ctor.members && Array.isArray(ctor.members) ? ctor.members : [];
    }

    public setTeamStatus(status: TeamStatus): void {
        this.members.forEach((m) => (m.status = status));
    }
}
