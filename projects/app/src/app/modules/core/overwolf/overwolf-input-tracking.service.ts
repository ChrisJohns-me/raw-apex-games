import { Injectable } from "@angular/core";
import { BaseService } from "@app/modules/core/base-service.abstract.js";
import { SingletonServiceProviderFactory } from "@app/singleton-service.provider.factory.js";
import { Observable, Subject } from "rxjs";
import { InputTrackingDelegate } from "./api/games/input-tracking-delegate.js";
import { OWInputActivity, OWMouseEvent, OWMousePosition } from "./index.js";

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
