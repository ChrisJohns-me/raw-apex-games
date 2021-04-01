import { OWGameEvent } from "@core/overwolf-data-provider";
import { isEmpty, recursiveJSONParse } from "@shared/utilities";
import { Subject } from "rxjs";

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
        newGameEvent?.events?.forEach((e) => {
            const cleanedGameEvent = this.cleanGameEvent(e);
            if (cleanedGameEvent) this.newGameEvent$.next(cleanedGameEvent);
        });
    }

    private cleanGameEvent(event: overwolf.games.events.GameEvent): Optional<OWGameEvent> {
        if (isEmpty(event?.name)) return;
        if (!event || !event.name) return;
        const newEvent: OWGameEvent = {
            name: event.name as keyof overwolf.gep.ApexLegends.EventData,
            data: recursiveJSONParse<OWGameEvent["data"]>(event.data),
        };
        return newEvent;
    }
}
