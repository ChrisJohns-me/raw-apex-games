import { Legend } from "./legend";
import { PlatformHardware, PlatformSoftware } from "./platform";

export enum PlayerStatus {
    Alive = "alive",
    Knocked = "knocked",
    Eliminated = "eliminated",
}

export class Player {
    public readonly name: string;
    public isLocalPlayer: boolean;
    public teamId?: number;
    public isTeammate: boolean;
    public platformHardware: PlatformHardware;
    public platformSoftware: PlatformSoftware;
    public get legend(): Legend {
        return this._legend;
    }
    public get status(): PlayerStatus {
        return this._status;
    }

    private _legend: Legend;
    private _status: PlayerStatus;

    constructor(
        playerName: string,
        init?: {
            isLocalPlayer?: boolean;
            teamId?: number;
            isTeammate?: boolean;
            platformHardware?: PlatformHardware;
            platformSoftware?: PlatformSoftware;
            legend?: Legend;
            status?: PlayerStatus;
        }
    ) {
        this.name = playerName;
        this.isLocalPlayer = init?.isLocalPlayer ?? false;
        this.teamId = init?.teamId;
        this.isTeammate = init?.isTeammate ?? false;
        this.platformHardware = init?.platformHardware ?? PlatformHardware.PC;
        this.platformSoftware = init?.platformSoftware ?? PlatformSoftware.Origin;
        this._legend = init?.legend ?? new Legend();
        this._status = init?.status ?? PlayerStatus.Alive;
    }

    public setStatus(status: PlayerStatus): void {
        this._status = status;
    }

    public setLegend(legend: Legend): void {
        this._legend = legend;
    }
}
