import { OWGameEvent } from "@allfather-app/app/modules/core/overwolf-data-provider";
import { Subject } from "rxjs";
import {
    isEmpty,
    recursiveEmptyObjectsToNull,
    recursiveEmptyStringsToNull,
    recursiveJSONParse,
    recursiveParseBoolean,
    recursiveParseNull,
} from "shared/utilities";

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
        const eventDataJSON = recursiveJSONParse(event.data);
        const eventDataBooleanParsed = recursiveParseBoolean(eventDataJSON);
        const eventDataNullParsed = recursiveParseNull(eventDataBooleanParsed);
        const eventDataEmptyObjectsAsNull = recursiveEmptyObjectsToNull(eventDataNullParsed);
        const eventDataEmptyStringsAsNull = recursiveEmptyStringsToNull(eventDataEmptyObjectsAsNull);
        const eventData = eventDataEmptyStringsAsNull;

        const newEvent: OWGameEvent = {
            name: event.name as keyof overwolf.gep.ApexLegends.EventData,
            data: eventData as OWGameEvent["data"],
        };
        return newEvent;
    }
}