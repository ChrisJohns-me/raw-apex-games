import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { BaseService } from "../base-service.abstract";
import { HotKeyDelegate } from "./api/settings/hotkey-delegate";
import {
    OWHotKeyAssignHotkeyObject,
    OWHotKeyGetAssignedHotkeyResult,
    OWHotKeyOnPressedEvent,
    OWHotKeyUnassignHotkeyObject,
} from "./types/overwolf-types";

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
