import { bindCallback, Observable } from "rxjs";
import { map } from "rxjs/operators";

export class SettingsDelegate {
    /**
     * Sets whether the window should have minimize/restore animations while in game.
     * @param windowId The id or name of the window to set
     * @returns {true} if successful
     * @returns {error} if failed
     */
    public setRestoreAnimationsEnabled(windowId: string, shouldEnableAnimations: boolean): Observable<true> {
        const getSetRestoreAnimationsEnabledObs = bindCallback(overwolf.windows.setRestoreAnimationsEnabled);
        return getSetRestoreAnimationsEnabledObs(windowId, shouldEnableAnimations).pipe(
            map((result) => {
                if (result?.success) return true;
                else throw new Error(result?.error);
            })
        );
    }

    /**
     * Add Window In Game styling (for example, allowing mouse clicks to be passed through the window into the game)
     * @param windowId The id or name of the window to add the style to
     * @param style "InputPassThrough"
     * @returns {true} if successful
     * @returns {error} if failed
     */
    public setWindowStyle(windowId: string, style: overwolf.windows.enums.WindowStyle): Observable<true> {
        const getSetWindowStyleObs = bindCallback(overwolf.windows.setWindowStyle);
        return getSetWindowStyleObs(windowId, style).pipe(
            map((result) => {
                if (result?.success) return true;
                else throw new Error(result?.error);
            })
        );
    }

    /**
     * @param windowId The id or name of the window to remove the style from
     * @param style "InputPassThrough" | "BottomMost"
     * @returns {true} if successful
     * @returns {error} if failed
     */
    public removeWindowStyle(windowId: string, style: overwolf.windows.enums.WindowStyle): Observable<true> {
        const getRemoveWindowStyleObs = bindCallback(overwolf.windows.removeWindowStyle);
        return getRemoveWindowStyleObs(windowId, style).pipe(
            map((result) => {
                if (result?.success) return true;
                else throw new Error(result?.error);
            })
        );
    }

    /**
     * Set the current window mute state (on/off).
     * @param mute Window mute state (true - mute is on, false - mute is off)
     * @returns {true} if successful
     * @returns {error} if failed
     */
    public setMute(mute: boolean): Observable<true> {
        const getSetMuteObs = bindCallback(overwolf.windows.setMute);
        return getSetMuteObs(mute).pipe(
            map((result) => {
                if (result?.success) return true;
                else throw new Error(result?.error);
            })
        );
    }

    /**
     * Mutes all sound sources for the current window.
     * @param windowId The id or name of the window to set
     * @returns {true} if successful
     * @returns {error} if failed
     */
    public muteAll(): Observable<true> {
        const getMuteAllObs = bindCallback(overwolf.windows.muteAll);
        return getMuteAllObs().pipe(
            map((result) => {
                if (result?.success) return true;
                else throw new Error(result?.error);
            })
        );
    }

    /**
     * Get the window’s mute state (true/false).
     */
    public isMuted(): Observable<boolean> {
        const getIsMutedObs = bindCallback(overwolf.windows.isMuted);
        return getIsMutedObs().pipe(
            map((result) => {
                if (result?.success) return result.muted;
                else throw new Error(result?.error);
            })
        );
    }
}
