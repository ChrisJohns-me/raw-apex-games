import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { AllfatherService } from "../allfather-service.abstract";
import { InputTrackingDelegate } from "./api/games/input-tracking-delegate";
import { OWMouseEvent } from "./types/overwolf-types";

/**
 * @classdesc Input tracking events from the Overwolf API.
 */
@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("OverwolfInputTrackingService", OverwolfInputTrackingService, deps),
})
export class OverwolfInputTrackingService extends AllfatherService {
    //#region Delegate Outputs
    public get mouseDown$(): Subject<OWMouseEvent> {
        return this.inputTrackingDelegate.mouseDown$;
    }
    public get mouseUp$(): Subject<OWMouseEvent> {
        return this.inputTrackingDelegate.mouseUp$;
    }

    private readonly inputTrackingDelegate = new InputTrackingDelegate();
    //#endregion

    constructor() {
        super();
        this.inputTrackingDelegate.startEventListeners();
    }

    public ngOnDestroy(): void {
        this.inputTrackingDelegate.stopEventListeners();
        super.ngOnDestroy();
    }
}
