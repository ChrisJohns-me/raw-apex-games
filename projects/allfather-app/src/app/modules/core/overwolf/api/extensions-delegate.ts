import { bindCallback, map, Observable, Subject } from "rxjs";
import { OWAppLaunchTriggeredEvent, OWExtensionUpdateState } from "../types/overwolf-types";
import { OverwolfEventListenerDelegate } from "./overwolf-delegate";

export class ExtensionsDelegate implements OverwolfEventListenerDelegate {
    /**
     * Fires when the current app is launched while already running.
     * This is useful in the case where the app has custom logic for clicking
     * its dock button while it is already running.
     * @see https://overwolf.github.io/docs/api/overwolf-extensions#onapplaunchtriggered
     * @todo Type definition (overwolf.extensions.AppLaunchTriggeredEvent) is incorrect,
     */
    public readonly appLaunchTriggeredEvent$ = new Subject<OWAppLaunchTriggeredEvent>();

    public eventListeners = {
        ONAPPLAUNCHTRIGGERED: this.onAppLaunchTriggered,
    };

    public startEventListeners(): void {
        this.stopEventListeners();
        overwolf.extensions.onAppLaunchTriggered.addListener(this.eventListeners.ONAPPLAUNCHTRIGGERED.bind(this));
    }

    public stopEventListeners(): void {
        overwolf.extensions.onAppLaunchTriggered.removeListener(this.eventListeners.ONAPPLAUNCHTRIGGERED.bind(this));
    }

    public relaunchApp(): void {
        overwolf.extensions.relaunch();
    }

    /**
     * Checks if an update is available for the calling extension.
     * Always returns UpToDate when used on an unpacked extension.
     * This function allows the current app to check if there is an extension update,
     * without having to wait for Overwolf to do so.
     * Calling this function will not automatically update the extension, just checks if an update exists.
     * @returns {OWExtensionUpdateState}
     * @throws {error} if failed
     */
    public checkForExtensionUpdate(): Observable<OWExtensionUpdateState> {
        const checkForExtensionUpdateObs = bindCallback(overwolf.extensions.checkForExtensionUpdate);

        return checkForExtensionUpdateObs().pipe(
            map((result) => {
                if (result?.success && result?.state) return result.state as OWExtensionUpdateState;
                else throw new Error(result?.error || (result as any)?.reason);
            })
        );
    }

    private onAppLaunchTriggered(appLaunchTriggeredEvent: overwolf.extensions.AppLaunchTriggeredEvent): void {
        this.appLaunchTriggeredEvent$.next(appLaunchTriggeredEvent as OWAppLaunchTriggeredEvent);
    }
}
