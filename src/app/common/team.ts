import { Player, PlayerStatus, PlayerStatus as TeamStatus } from "./player";

export { TeamStatus };

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

    constructor(
        teamId: number,
        init?: {
            isFriendly?: boolean;
            members?: Player[];
        }
    ) {
        this.teamId = teamId;
        this.isFriendly = init?.isFriendly ?? false;
        this._members = init?.members && Array.isArray(init?.members) ? init.members : [];
    }

    public setTeamStatus(status: TeamStatus): void {
        this.members.forEach((m) => m.setStatus(status));
    }

    public addMember(member: Player): void {
        this._members.push(member);
    }
}
