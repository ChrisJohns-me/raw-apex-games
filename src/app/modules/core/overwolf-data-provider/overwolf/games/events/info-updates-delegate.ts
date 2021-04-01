import { OWInfoUpdates2Event } from "@core/overwolf-data-provider";
import { recursiveJSONParse } from "@shared/utilities";
import { Subject } from "rxjs";

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
        const newInfoUpdate: OWInfoUpdates2Event = {
            info: recursiveJSONParse<OWInfoUpdates2Event["info"]>(owInfoUpdate.info),
            feature: owInfoUpdate.feature as OWInfoUpdates2Event["feature"],
        };
        return newInfoUpdate;
    }
}
