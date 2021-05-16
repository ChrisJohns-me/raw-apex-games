import { BehaviorSubject } from "rxjs";
import { OWRunningGameInfo } from "../..";
import { OverwolfEventListenerDelegate } from "../overwolf-delegate";

export class GameInfoDelegate implements OverwolfEventListenerDelegate {
    public readonly gameInfo$ = new BehaviorSubject<Optional<OWRunningGameInfo>>(undefined);

    public eventListeners = {
        GAMELAUNCHED: this.onGameInfo,
        RUNNINGGAMEINFO: this.onGameInfo,
        GAMEINFOUPDATED: (e: overwolf.games.GameInfoUpdatedEvent): void => this.onGameInfo(e?.gameInfo),
    };

    constructor(private readonly apexLegendsClassID: number) {}

    public startEventListeners(): void {
        this.stopEventListeners();
        overwolf.games.getRunningGameInfo(this.eventListeners.RUNNINGGAMEINFO.bind(this));
        overwolf.games.onGameInfoUpdated.addListener(this.eventListeners.GAMEINFOUPDATED.bind(this));
    }

    public stopEventListeners(): void {
        overwolf.games.onGameInfoUpdated.removeListener(this.eventListeners.GAMEINFOUPDATED.bind(this));
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
