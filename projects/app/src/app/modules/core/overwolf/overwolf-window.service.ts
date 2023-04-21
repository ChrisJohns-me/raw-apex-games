import { SingletonServiceProviderFactory } from "#app/singleton-service.provider.factory.js";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { InstancesDelegate } from "./api/windows/instances-delegate.js";
import { SettingsDelegate } from "./api/windows/settings-delegate.js";
import { SizeDelegate } from "./api/windows/size-delegate.js";
import { StateDelegate } from "./api/windows/state-delegate.js";
import { VisibilityDelegate } from "./api/windows/visibility-delegate.js";

/**
 * @classdesc
 */
@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("OverwolfWindowService", OverwolfWindowService, deps),
})
export class OverwolfWindowService {
    //#region Delegate Outputs
    public readonly instances = new InstancesDelegate();
    public readonly settings = new SettingsDelegate();
    public readonly size = new SizeDelegate();
    public readonly state = new StateDelegate();
    public readonly visibility = new VisibilityDelegate();
    //#endregion

    private destroy$ = new Subject<void>();

    constructor() {
        this.startWindowEventListeners();
    }

    public ngOnDestroy(): void {
        this.stopWindowEventListeners();
        this.destroy$.next();
        this.destroy$.complete();
    }

    private startWindowEventListeners(): void {
        this.state.startEventListeners();
        console.debug(`[${this.constructor.name}] Window Delegate Event Listeners Started`);
    }

    private stopWindowEventListeners(): void {
        this.state.stopEventListeners();
        console.debug(`[${this.constructor.name}] Window Delegate Event Listeners Stopped`);
    }
}
