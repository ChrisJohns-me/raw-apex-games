import { Subject } from "rxjs";
import { recursiveJSONParse } from "src/utilities";
import { OWInfoUpdates2Event } from "../../../overwolf-types";

export class InfoUpdatesDelegate {
    public readonly infoUpdates = new Subject<OWInfoUpdates2Event>();

    /**
     * Meta match info, inventory, weapons, inUse, etc.
     * @param infoUpdates
     */
    public onInfoUpdates2(infoUpdate: overwolf.games.events.InfoUpdates2Event): void {
        console.debug(`[${this.constructor.name}] onInfoUpdates`);
        if (!infoUpdate) {
            console.warn("Unrecognized info.", infoUpdate);
            return;
        }
        const cleanedInfoUpdate = this.cleanInfoUpdate(infoUpdate);
        this.infoUpdates.next(cleanedInfoUpdate);
    }

    private cleanInfoUpdate(owInfoUpdate: overwolf.games.events.InfoUpdates2Event): Optional<OWInfoUpdates2Event> {
        if (!owInfoUpdate || !owInfoUpdate.info || !owInfoUpdate.feature) return;
        const newInfoUpdate: OWInfoUpdates2Event = {
            info: owInfoUpdate.info,
            feature: recursiveJSONParse<OWInfoUpdates2Event["feature"]>(owInfoUpdate.feature),
        };
        return newInfoUpdate;
    }
}
