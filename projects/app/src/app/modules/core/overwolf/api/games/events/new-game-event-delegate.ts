import { isEmpty } from "#shared/utilities/primitives/boolean.js";
import {
    recursiveEmptyObjectsToNull,
    recursiveEmptyStringsToNull,
    recursiveJSONParse,
    recursiveParseBoolean,
    recursiveParseNull,
} from "#shared/utilities/primitives/object.js";
import { Subject } from "rxjs";
import { OWGameEvent } from "../../../types/overwolf-types.js";
import { OverwolfEventListenerDelegate } from "../../overwolf-delegate.js";

export class NewGameEventDelegate implements OverwolfEventListenerDelegate {
    public eventListeners = {
        NEWGAMEEVENT: this.onNewGameEvents,
    };

    public readonly newGameEvent$ = new Subject<OWGameEvent>();

    public startEventListeners(): void {
        this.stopEventListeners();
        overwolf.games.events.onNewEvents.addListener(this.eventListeners.NEWGAMEEVENT.bind(this));
    }

    public stopEventListeners(): void {
        overwolf.games.events.onNewEvents.removeListener(this.eventListeners.NEWGAMEEVENT.bind(this));
    }

    /**
     * Feature events: Kill feed, damage, etc.
     * @param newGameEventList
     */
    private onNewGameEvents(newGameEventList: overwolf.games.events.NewGameEvents): void {
        const events = newGameEventList?.events;
        if (!events || !Array.isArray(events)) {
            console.warn("Unrecognized event.", events);
            return;
        }
        newGameEventList?.events?.forEach((e) => {
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
