import { OWRunningGameInfo } from "@core/overwolf-data-provider/overwolf-types";
import { BehaviorSubject } from "rxjs";

export class GameInfoDelegate {
    public readonly gameInfo$ = new BehaviorSubject<Optional<OWRunningGameInfo>>(undefined);

    constructor(private readonly apexLegendsClassID: number) {}

    /**
     * Game process information updates
     * @param gameInfoUpdate
     */
    public onGameInfo(gameInfo?: OWRunningGameInfo): void {
        if (!gameInfo || gameInfo.classId !== this.apexLegendsClassID) return;
        console.debug(`[${this.constructor.name}] onGameInfo`, gameInfo);
        this.gameInfo$.next(gameInfo);
    }
}
