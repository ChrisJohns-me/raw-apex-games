import { ReplaySubject } from "rxjs";
import { OWGameInfoUpdatedEvent } from "../../overwolf-types";

export class GameInfoUpdatedDelegate {
    public readonly gameInfoUpdated = new ReplaySubject<OWGameInfoUpdatedEvent>();

    /**
     * Game process information updates
     * @param gameInfoUpdate
     */
    public onGameInfoUpdated(gameInfoUpdate: OWGameInfoUpdatedEvent): void {
        console.debug(`[${this.constructor.name}] onGameInfoUpdated`, gameInfoUpdate);
        if (!gameInfoUpdate?.gameInfo) return;
        this.gameInfoUpdated.next(gameInfoUpdate);
    }
}
