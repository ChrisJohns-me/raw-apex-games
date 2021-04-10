import { bindCallback, Observable } from "rxjs";
import { map } from "rxjs/operators";

/**
 * @classdesc Showing, hiding, closing, opening Overwolf windows.
 */
export class VisibilityDelegate {
    /**
     * Hides the window from screen and taskbar.
     * @param windowId The id or name of the window to hide
     * @returns windowId after the window was hidden
     */
    public hide(windowId: string): Observable<string> {
        const getHideObs = bindCallback(overwolf.windows.hide);
        return getHideObs(windowId).pipe(
            map((result) => {
                if (result?.success && result?.window_id) return result.window_id as string;
                else throw new Error(result?.error);
            })
        );
    }

    /**
     * Get the Visibility state of the window.
     * Note: Used only with windows without a transparent border.
     * @returns "hidden" | "full" | "partial"
     */
    public isWindowVisibleToUser(): Observable<"hidden" | "full" | "partial"> {
        const getIsWindowVisibleToUserObs = bindCallback(overwolf.windows.isWindowVisibleToUser);
        return getIsWindowVisibleToUserObs().pipe(
            map((result) => {
                if (result?.success && result?.visible) return result.visible;
                else throw new Error(result?.error);
            })
        );
    }

    /**
     * Change the window’s topmost status. Handle with care as topmost windows can negatively impact user experience.
     * @param windowId The id or name of the window to set
     * @param shouldBeTopmost
     * @returns {true} if successful
     * @returns {error} if failed
     */
    public setTopmost(windowId: string, shouldBeTopmost: boolean): Observable<true> {
        const getSetTopmostObs = bindCallback(overwolf.windows.setTopmost);
        return getSetTopmostObs(windowId, shouldBeTopmost).pipe(
            map((result) => {
                if (result?.success) return true;
                else throw new Error(result?.error);
            })
        );
    }

    /**
     * Sends the window to the back.
     * @param windowId The id or name of the window to set
     * @returns {true} if successful
     * @returns {error} if failed
     */
    public sendToBack(windowId: string): Observable<true> {
        const getSendToBackObs = bindCallback(overwolf.windows.sendToBack);
        return getSendToBackObs(windowId).pipe(
            map((result) => {
                if (result?.success) return true;
                else throw new Error(result?.error);
            })
        );
    }

    /**
     * Change this window location in the opened windows stack.
     * @param windowId The id or name of the window to set
     * @param properties The desired location in the windows stack
     * @returns {true} if successful
     * @returns {error} if failed
     */
    public setPosition(windowId: string, properties: overwolf.windows.SetWindowPositionProperties): Observable<true> {
        type SetPositionFnType = (
            windowId: string,
            properties: overwolf.windows.SetWindowPositionProperties,
            callback: overwolf.CallbackFunction<overwolf.Result>
        ) => void;
        const getSetPositionObs = bindCallback(overwolf.windows.setPosition as SetPositionFnType);
        return getSetPositionObs(windowId, properties).pipe(
            map((result) => {
                if (result?.success) return true;
                else throw new Error(result?.error);
            })
        );
    }

    /**
     * For in-game windows, calling this function will always bring the window to the front.
     * For desktop/native windows, the behavior depends on the game mode AND the grabFocus param:
     *  * Fullscreen game + grabFocus:false - The window will stay in the background behind the game.
     *  * Fullscreen game + grabFocus:true - The window will move to the foreground and take the focus. The game window will be minimized (use with caution, usually it's a bad UX).
     *  * Windowed game + grabFocus:true/false - The window will move to the foreground. The game window will not be changed.
     * @param windowId The id or name of the window
     * @param grabFocus window will take system focus
     * @returns {true} if successful
     * @returns {error} if failed
     */
    public bringToFront(windowId: string, grabFocus: boolean): Observable<boolean> {
        type BringToFrontFnType = (windowId: string, grabFocus: boolean, callback: overwolf.CallbackFunction<overwolf.Result>) => void;
        const getBringToFrontObs = bindCallback(overwolf.windows.bringToFront as BringToFrontFnType);
        return getBringToFrontObs(windowId, grabFocus).pipe(
            map((result) => {
                if (result?.success) return true;
                else throw new Error(result?.error);
            })
        );
    }
}
