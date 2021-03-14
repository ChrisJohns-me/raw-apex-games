import { ReplaySubject } from "rxjs";
import { OWGameInfoUpdatedEvent } from "../../overwolf-types";

export class GameInfoUpdatedHandler {
    public readonly gameInfoUpdated = new ReplaySubject<OWGameInfoUpdatedEvent>();

    /**
     * Game process information updates
     * @param update
     */
    public onGameInfoUpdated(update: OWGameInfoUpdatedEvent): void {
        console.debug(`[${this.constructor.name}] onGameInfoUpdated`, update);
        if (!update?.gameInfo) return;
        this.gameInfoUpdated.next(update);
    }
}
