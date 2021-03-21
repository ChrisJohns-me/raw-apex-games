import { Legend } from "./legend";
import { PlatformHardware, PlatformSoftware } from "./platform";

export enum PlayerStatus {
    Alive = "alive",
    Knocked = "knocked",
    Eliminated = "eliminated",
}

type PlayerConstructor = {
    name?: string;
    rosterId?: string;
    isMe?: boolean;
    status?: PlayerStatus;
    legend?: Legend;
    teamId?: number;
    platformHardware?: PlatformHardware;
    platformSoftware?: PlatformSoftware;
    lastActivity?: Date;
};

export class Player {
    public name?: string;
    public rosterId?: string;
    public isMe: boolean;
    public status: PlayerStatus;
    public legend: Legend;
    public teamId?: number;
    public platformHardware?: PlatformHardware;
    public platformSoftware?: PlatformSoftware;
    public lastActivity? = new Date();

    constructor(ctor?: PlayerConstructor) {
        this.name = ctor?.name;
        this.rosterId = ctor?.rosterId;
        this.isMe = ctor?.isMe ?? false;
        this.status = ctor?.status ?? PlayerStatus.Alive;
        this.legend = ctor?.legend ?? new Legend();
        this.teamId = ctor?.teamId;
        this.platformHardware = ctor?.platformHardware;
        this.platformSoftware = ctor?.platformSoftware;
        this.lastActivity = ctor?.lastActivity;
    }
}
