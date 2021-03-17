import { Subject } from "rxjs";
import { recursiveJSONParse } from "src/utilities";
import { OWGameEvent } from "../../../overwolf-types";

export class NewGameEventDelegate {
    public readonly newGameEvent$ = new Subject<OWGameEvent>();

    /**
     * Feature events: Kill feed, damage, etc.
     * @param newGameEvent
     */
    public onNewGameEvents(newGameEvent: overwolf.games.events.NewGameEvents): void {
        console.debug(`[${this.constructor.name}] onNewEvents`, newGameEvent);
        const events = newGameEvent?.events;
        if (!events || !Array.isArray(events)) {
            console.warn("Unrecognized event.", events);
            return;
        }
        newGameEvent?.events.forEach((e) => {
            const cleanedGameEvent = this.cleanGameEvent(e);
            this.newGameEvent$.next(cleanedGameEvent);
        });
    }

    private cleanGameEvent(event: overwolf.games.events.GameEvent): Optional<OWGameEvent> {
        if (!event || !event.name) return;
        const newEvent: OWGameEvent = {
            name: event.name as keyof overwolf.gep.ApexLegends.EventData,
            data: recursiveJSONParse<OWGameEvent["data"]>(event.data),
        };
        return newEvent;
    }
}
