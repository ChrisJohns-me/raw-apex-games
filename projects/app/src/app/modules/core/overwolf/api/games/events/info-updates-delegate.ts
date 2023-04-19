import { Subject, Subscription, bindCallback, from } from "rxjs";
import { filter, map, switchMap } from "rxjs/operators";
import {
    recursiveEmptyObjectsToNull,
    recursiveEmptyStringsToNull,
    recursiveJSONParse,
    recursiveParseBoolean,
    recursiveParseNull,
} from "../../../../../../../../../../common/utilities/";
import { OWInfoUpdates2Event } from "../../../types/overwolf-types";
import { OverwolfEventListenerDelegate } from "../../overwolf-delegate";

export class InfoUpdatesDelegate implements OverwolfEventListenerDelegate {
    public readonly infoUpdates$ = new Subject<OWInfoUpdates2Event>();

    public eventListeners = {
        INFOUPDATES2: this.onInfoUpdates2,
    };

    private prepopulationSubscription?: Subscription;

    public startEventListeners(): void {
        this.stopEventListeners();
        this.handlePrepopulation();
        overwolf.games.events.onInfoUpdates2.addListener(this.eventListeners.INFOUPDATES2.bind(this));
    }

    public stopEventListeners(): void {
        this.prepopulationSubscription?.unsubscribe();
        overwolf.games.events.onInfoUpdates2.removeListener(this.eventListeners.INFOUPDATES2.bind(this));
    }

    /** On startup, manually injects Overwolf `getInfo` data into the infoUpdates observable. */
    private handlePrepopulation(): void {
        console.debug(`[${this.constructor.name}] Handling Prepopulation`);
        const getInfoObs = bindCallback(overwolf.games.events.getInfo);
        this.prepopulationSubscription = getInfoObs()
            .pipe(
                filter((result) => !!result.success),
                map((result) => result.res),
                switchMap((infoResult) => from(Object.entries(infoResult) as [overwolf.gep.ApexLegends.GameInfoKey, any][])),
                map(([key, value]) => ({ feature: key, info: { [key]: value } }))
            )
            .subscribe(this.onInfoUpdates2.bind(this));
    }

    /**
     * Meta match info, inventory, weapons, inUse, etc.
     * @param infoUpdates
     */
    private onInfoUpdates2(infoUpdate: overwolf.games.events.InfoUpdates2Event): void {
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
