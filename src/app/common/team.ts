import { Player, PlayerStatus, PlayerStatus as TeamStatus } from "./player";

export { TeamStatus };

type TeamConstructor = {
    teamId: number;
    isFriendly?: boolean;
    members?: Player[];
};

export class Team {
    public readonly teamId: number;
    public readonly isFriendly: boolean;
    public get members(): Player[] {
        return this._members;
    }
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

    private _members: Player[] = [];

    constructor({ teamId, isFriendly, members }: TeamConstructor) {
        this.teamId = teamId;
        this.isFriendly = isFriendly ?? false;
        this._members = !!members && Array.isArray(members) ? members : [];
    }

    public setTeamStatus(status: TeamStatus): void {
        this.members.forEach((m) => m.setStatus(status));
    }

    public addMember(member: Player): void {
        this._members.push(member);
    }
}
