import { Subject } from "rxjs";
import { GameEventData, OWNewGameEvents } from "./overwolf-types";

export class NewGameEventHandler {
    public readonly gameEvent = new Subject<GameEventData>();

    /**
     * Feature events: Kill feed, damage, etc.
     * @param newGameEvent
     */
    public onNewEvents(newGameEvent: OWNewGameEvents): void {
        console.debug(`[${this.constructor.name}] onNewEvents`, newGameEvent);
        const events = newGameEvent?.events;
        if (!events || !Array.isArray(events)) {
            console.warn("Unrecognized event.", events);
            return;
        }
        newGameEvent?.events.forEach((e) => this.gameEvent.next(e));
    }
}
