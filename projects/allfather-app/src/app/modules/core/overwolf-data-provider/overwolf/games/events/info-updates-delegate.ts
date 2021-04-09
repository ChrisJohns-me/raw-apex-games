import { OWInfoUpdates2Event } from "@allfather-app/app/modules/core/overwolf-data-provider";
import { Subject } from "rxjs";
import {
    recursiveEmptyObjectsToNull,
    recursiveEmptyStringsToNull,
    recursiveJSONParse,
    recursiveParseBoolean,
    recursiveParseNull,
} from "shared/utilities";

export class InfoUpdatesDelegate {
    public readonly infoUpdates$ = new Subject<OWInfoUpdates2Event>();

    /**
     * Meta match info, inventory, weapons, inUse, etc.
     * @param infoUpdates
     */
    public onInfoUpdates2(infoUpdate: overwolf.games.events.InfoUpdates2Event): void {
        console.debug(`[${this.constructor.name}] onInfoUpdates`, infoUpdate);
        if (!infoUpdate) {
            console.warn("Unrecognized info.", infoUpdate);
            return;
        }
        const cleanedInfoUpdate = this.cleanInfoUpdate(infoUpdate);
        if (cleanedInfoUpdate) this.infoUpdates$.next(cleanedInfoUpdate);
    }

    private cleanInfoUpdate(owInfoUpdate: overwolf.games.events.InfoUpdates2Event): Optional<OWInfoUpdates2Event> {
        if (!owInfoUpdate || !owInfoUpdate.info || !owInfoUpdate.feature) return;
        const infoDataJSON = recursiveJSONParse(owInfoUpdate.info);
        const infoDataBooleanParsed = recursiveParseBoolean(infoDataJSON);
        const infoDataNullParsed = recursiveParseNull(infoDataBooleanParsed);
        const infoDataEmptyObjectsAsNull = recursiveEmptyObjectsToNull(infoDataNullParsed);
        const infoDataEmptyStringsAsNull = recursiveEmptyStringsToNull(infoDataEmptyObjectsAsNull);
        const infoDataParsed = infoDataEmptyStringsAsNull;

        const newInfoUpdate: OWInfoUpdates2Event = {
            info: infoDataParsed as OWInfoUpdates2Event["info"],
            feature: owInfoUpdate.feature as OWInfoUpdates2Event["feature"],
        };
        return newInfoUpdate;
    }
}
