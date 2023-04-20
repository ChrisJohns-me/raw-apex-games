import { bindCallback, Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import {
    OWHotKeyAssignHotkeyObject,
    OWHotKeyGetAssignedHotkeyResult,
    OWHotKeyOnChangedEvent,
    OWHotKeyOnPressedEvent,
    OWHotKeyUnassignHotkeyObject,
} from "../../types/overwolf-types.js";

export class HotKeyDelegate {
    public readonly onPressed$ = new Subject<OWHotKeyOnPressedEvent>();
    public readonly onChanged$ = new Subject<OWHotKeyOnChangedEvent>();

    public eventListeners = {
        ONPRESSED: this.onPressed,
        ONCHANGED: this.onChanged,
    };

    public startEventListeners(): void {
        this.stopEventListeners();
        overwolf.settings.hotkeys.onPressed.addListener(this.eventListeners.ONPRESSED.bind(this));
        overwolf.settings.hotkeys.onChanged.addListener(this.eventListeners.ONCHANGED.bind(this));
    }

    public stopEventListeners(): void {
        overwolf.settings.hotkeys.onPressed.removeListener(this.eventListeners.ONPRESSED.bind(this));
        overwolf.settings.hotkeys.onChanged.removeListener(this.eventListeners.ONCHANGED.bind(this));
    }

    /**
     * Gets the hotkey object
     * @returns {GetAssignedHotkeyResult}
     * @returns {error} if failed
     */
    public get(): Observable<OWHotKeyGetAssignedHotkeyResult> {
        const getObs = bindCallback(overwolf.settings.hotkeys.get);
        return getObs().pipe(
            map((result) => {
                if (result?.success) return result;
                else throw new Error(result?.error);
            })
        );
    }

    /**
     * Assigns a hotkey to the specified action (in manifest)
     * @param {AssignHotkeyObject} hotkey Object for assigned hotkey properties
     * @returns {true} if successful
     * @returns {error} if failed
     */
    public assign(hotkey: OWHotKeyAssignHotkeyObject): Observable<true> {
        const assignObs = bindCallback(overwolf.settings.hotkeys.assign);
        return assignObs(hotkey).pipe(
            map((result) => {
                if (result?.success) return true;
                else throw new Error(result?.error);
            })
        );
    }

    /**
     * Assigns a hotkey to the specified action (in manifest)
     * @param {UnassignHotkeyObject} hotkey Object for assigned hotkey properties
     * @returns {true} if successful
     * @returns {error} if failed
     */
    public unassign(hotkey: OWHotKeyUnassignHotkeyObject): Observable<true> {
        const unassignObs = bindCallback(overwolf.settings.hotkeys.unassign);
        return unassignObs(hotkey).pipe(
            map((result) => {
                if (result?.success) return true;
                else throw new Error(result?.error);
            })
        );
    }

    private onPressed(event: OWHotKeyOnPressedEvent): void {
        this.onPressed$.next(event);
    }

    private onChanged(event: OWHotKeyOnChangedEvent): void {
        this.onChanged$.next(event);
    }
}
