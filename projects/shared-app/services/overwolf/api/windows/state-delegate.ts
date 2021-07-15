import { bindCallback, Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { OverwolfEventListenerDelegate } from "../overwolf-delegate";

/**
 * @classdesc Minimizing, maximizing, closing, restoring, Overwolf windows.
 */
export class StateDelegate implements OverwolfEventListenerDelegate {
    public readonly stateChange$ = new Subject<overwolf.windows.WindowStateChangedEvent>();

    public eventListeners = {
        STATECHANGED: (e: overwolf.windows.WindowStateChangedEvent): void => this.onStateChanged(e),
    };

    public startEventListeners(): void {
        throw new Error("Method not implemented.");
    }

    public stopEventListeners(): void {
        throw new Error("Method not implemented.");
    }

    /**
     * Closes the window.
     * @param windowId The id or name of the window for which to change the position
     * @returns {true} if successful
     * @returns {error} if failed
     */
    public close(windowId: string): Observable<true> {
        const getCloseObs = bindCallback(overwolf.windows.close);
        return getCloseObs(windowId).pipe(
            map((result) => {
                if (result?.success) return true;
                else throw new Error(result?.error);
            })
        );
    }

    /**
     * Minimizes the window.
     * This function will not work if the manifest resizable flag is set to false.
     * When minimizing a native window, the window object values for top,left,widthand height are unexpected and shouldn't be regarded.
     * @param windowId The id or name of the window for which to change the position
     * @returns {true} if successful
     * @returns {error} if failed
     */
    public minimize(windowId: string): Observable<true> {
        const getMinimizeObs = bindCallback(overwolf.windows.minimize);
        return getMinimizeObs(windowId).pipe(
            map((result) => {
                if (result?.success) return true;
                else throw new Error(result?.error);
            })
        );
    }

    /**
     * Maximizes the window.
     * This function will not work if the manifest resizable flag is set to false.
     * If you would like to "unmaximize" the window after calling "maximize()", you can
     * call window.restore(), to restore the window to the previous size/position.
     * @param windowId The id or name of the window to maximize
     * @returns {true} if successful
     * @returns {error} if failed
     */
    public maximize(windowId: string): Observable<true> {
        const getMaximizeObs = bindCallback(overwolf.windows.maximize);
        return getMaximizeObs(windowId).pipe(
            map((result) => {
                if (result?.success) return true;
                else throw new Error(result?.error);
            })
        );
    }

    /**
     * Restores a minimized/maximize/hidden window.
     * When restoring a minimized/maximized window, it restores the window to the previous size/position.
     * When restoring a (non-desktop) window that is partly out of the game bounds, it repositions the window so that it fully fits inside the game bounds
     * @param windowId The id or name of the window to restore
     * @returns {true} if successful
     * @returns {string} windowID of restored window
     */
    public restore(windowId: string): Observable<string> {
        const getRestoreObs = bindCallback(overwolf.windows.restore);
        return getRestoreObs(windowId).pipe(
            map((result) => {
                if (result?.success && result?.window_id) return result.window_id;
                else throw new Error(result?.error);
            })
        );
    }

    /**
     * Returns the state of the window (normal/minimized/maximized/closed).
     * @param windowId The id or name of the window
     */
    public getWindowState(windowId: string): Observable<overwolf.windows.GetWindowStateResult> {
        const getGetWindowStateObs = bindCallback(overwolf.windows.getWindowState);
        return getGetWindowStateObs(windowId).pipe(
            map((result) => {
                if (result?.success && result?.window_state) return result;
                else throw new Error(result?.error);
            })
        );
    }

    /**
     * Returns the state of all windows owned by the app (normal/minimized/maximized/closed).
     * @returns an array of windows states
     */
    public getWindowsState(): Observable<overwolf.windows.GetWindowsStatesResult> {
        const getGetWindowsStateObs = bindCallback(overwolf.windows.getWindowsStates);
        return getGetWindowsStateObs().pipe(
            map((result) => {
                if (result?.success && result.result) return result;
                else throw new Error(result?.error);
            })
        );
    }

    /**
     * Flashes a window.
     * @param windowId The id of the window to flash
     * @param behavior "automatic" | "on" | "off"
     *  * automatic = Turns off automatically when the window regains focus. Does not turn on if window is already in focus.
     *  * on = Turns flashing on
     *  * off = Turns flashing off
     * @returns {true} if successful
     * @returns {error} if failed
     */
    public flash(windowId: string, behavior: overwolf.windows.enums.FlashBehavior): Observable<true> {
        const getFlashObs = bindCallback(overwolf.windows.flash);
        return getFlashObs(windowId, behavior).pipe(
            map((result) => {
                if (result?.success) return true;
                else throw new Error(result?.error);
            })
        );
    }

    private onStateChanged(event: overwolf.windows.WindowStateChangedEvent): void {
        this.stateChange$.next(event);
    }
}
