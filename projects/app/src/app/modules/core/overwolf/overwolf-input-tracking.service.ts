import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { SingletonServiceProviderFactory } from "../../../singleton-service.provider.factory";
import { BaseService } from "../base-service.abstract";
import { InputTrackingDelegate } from "./api/games/input-tracking-delegate";
import { OWInputActivity, OWMouseEvent, OWMousePosition } from "./types/overwolf-types";

/**
 * @classdesc Input tracking events from the Overwolf API.
 */
@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("OverwolfInputTrackingService", OverwolfInputTrackingService, deps),
})
export class OverwolfInputTrackingService extends BaseService {
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

    public getMousePosition(): Observable<OWMousePosition> {
        return this.inputTrackingDelegate.getMousePosition();
    }

    public getActivityInformation(): Observable<OWInputActivity> {
        return this.inputTrackingDelegate.getActivityInformation();
    }
}
