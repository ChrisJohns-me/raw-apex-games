import { Injectable } from "@angular/core";
import { SingletonServiceProviderFactory } from "@app/app/singleton-service.provider.factory";
import { Observable, Subject } from "rxjs";
import { BaseService } from "../base-service.abstract";
import { OSDelegate } from "./api/os-delegate";

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
