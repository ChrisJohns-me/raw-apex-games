import { BaseService } from "#app/modules/core/base-service.abstract.js";
import { SingletonServiceProviderFactory } from "#app/singleton-service.provider.factory.js";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { HotKeyDelegate } from "./api/settings/hotkey-delegate.js";
import {
    OWHotKeyAssignHotkeyObject,
    OWHotKeyGetAssignedHotkeyResult,
    OWHotKeyOnChangedEvent,
    OWHotKeyOnPressedEvent,
    OWHotKeyUnassignHotkeyObject,
} from "./index.js";

/**
 * @class OverwolfHotKeyService
 * @classdesc Wrapper for Overwolf's "overwolf.settings.hotkeys" API namespace.
 */
@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("OverwolfHotKeyService", OverwolfHotKeyService, deps),
})
export class OverwolfHotKeyService extends BaseService {
    //#region Delegate Outputs
    public get onPressed$(): Subject<OWHotKeyOnPressedEvent> {
        return this.hotKeyDelegate.onPressed$;
    }
    public get onChanged$(): Subject<OWHotKeyOnChangedEvent> {
        return this.hotKeyDelegate.onChanged$;
    }

    private readonly hotKeyDelegate = new HotKeyDelegate();
    //#endregion

    constructor() {
        super();
        this.startDelegateEventListeners();
    }

    public ngOnDestroy(): void {
        this.stopDelegateEventListeners();
        super.ngOnDestroy();
    }

    /**
     * Gets the hotkey object, which contains all of the hotkeys.
     * @returns {true} if successful
     * @returns {error} if failed
     */
    public getHotKeyObject(): Observable<OWHotKeyGetAssignedHotkeyResult> {
        return this.hotKeyDelegate.get();
    }

    /**
     * Assigns a hotkey to the specified action name (in manifest)
     * @returns {true} if successful
     * @returns {error} if failed
     */
    public assignHotKey(
        hotKeyName: string,
        gameId: number,
        virtualKey: number,
        ctrl: boolean,
        alt: boolean,
        shift: boolean
    ): Observable<true> {
        const assignHotKeyObject: OWHotKeyAssignHotkeyObject = {
            name: hotKeyName,
            gameId: gameId,
            virtualKey: virtualKey,
            modifiers: {
                ctrl: ctrl,
                alt: alt,
                shift: shift,
            },
        };

        return this.hotKeyDelegate.assign(assignHotKeyObject);
    }

    /**
     * Unassigns a hotkey to the specified action name (in manifest)
     * @returns {true} if successful
     * @returns {error} if failed
     */
    public unassignHotKey(hotKeyName: string): Observable<true> {
        const unassignHotKeyObject: OWHotKeyUnassignHotkeyObject = {
            name: hotKeyName,
        };

        return this.hotKeyDelegate.unassign(unassignHotKeyObject);
    }

    //#region Delegate event listeners
    private startDelegateEventListeners(): void {
        this.hotKeyDelegate.startEventListeners();
        console.debug(`[${this.constructor.name}] Hotkey Delegate Event Listeners Started`);
    }

    private stopDelegateEventListeners(): void {
        this.hotKeyDelegate.stopEventListeners();
        console.debug(`[${this.constructor.name}] Hotkey Delegate Event Listeners Stopped`);
    }
    //#endregion
}
