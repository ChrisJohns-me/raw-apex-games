import { Injectable } from "@angular/core";
import { BaseService } from "@app/modules/core/base-service.abstract.js";
import { SingletonServiceProviderFactory } from "@app/singleton-service.provider.factory.js";
import { Observable, Subject } from "rxjs";
import { OSDelegate } from "./api/os-delegate.js";

/**
 * @class OverwolfSystemTrayService
 * @classdesc Wrapper for Overwolf's "overwolf.os.tray." API namespace.
 */
@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("OverwolfSystemTrayService", OverwolfSystemTrayService, deps),
})
export class OverwolfSystemTrayService extends BaseService {
    //#region Delegate Outputs
    public get systemTrayIconClicked$(): Subject<void> {
        return this.osDelegate.systemTrayIconClicked$;
    }
    public get systemTrayIconDoubleClicked$(): Subject<void> {
        return this.osDelegate.systemTrayIconDoubleClicked$;
    }
    /** Returns menu item id */
    public get menuItemClicked$(): Subject<string> {
        return this.osDelegate.menuItemClicked$;
    }
    //#endregion

    private osDelegate = new OSDelegate();

    constructor() {
        super();
        this.osDelegate.startEventListeners();
    }

    public setTray(trayMenu: overwolf.os.tray.ExtensionTrayMenu): Observable<true> {
        return this.osDelegate.setMenu(trayMenu);
    }
}
