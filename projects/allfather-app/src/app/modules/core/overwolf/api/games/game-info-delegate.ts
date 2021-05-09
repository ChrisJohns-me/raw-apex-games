import { BehaviorSubject } from "rxjs";
import { OWRunningGameInfo } from "../..";
import { OverwolfEventListenerDelegate } from "../overwolf-delegate";

export class GameInfoDelegate implements OverwolfEventListenerDelegate {
    public readonly gameInfo$ = new BehaviorSubject<Optional<OWRunningGameInfo>>(undefined);

    public eventListeners = {
        GAMELAUNCHED: (e: overwolf.games.RunningGameInfo): void => this.onGameInfo(e),
        RUNNINGGAMEINFO: (e: overwolf.games.RunningGameInfo): void => this.onGameInfo(e),
        GAMEINFOUPDATED: (e: overwolf.games.GameInfoUpdatedEvent): void => this.onGameInfo(e?.gameInfo),
    };

    constructor(private readonly apexLegendsClassID: number) {}

    public startEventListeners(): void {
        this.stopEventListeners();
        overwolf.games.getRunningGameInfo(this.eventListeners.RUNNINGGAMEINFO);
        overwolf.games.onGameInfoUpdated.addListener(this.eventListeners.GAMEINFOUPDATED);
    }

    public stopEventListeners(): void {
        overwolf.games.onGameInfoUpdated.removeListener(this.eventListeners.GAMEINFOUPDATED);
    }

    /**
     * Game process information updates
     * @param gameInfoUpdate
     */
    private onGameInfo(gameInfo?: OWRunningGameInfo): void {
        if (!gameInfo || gameInfo.classId !== this.apexLegendsClassID) return;
        this.gameInfo$.next(gameInfo);
    }
}
