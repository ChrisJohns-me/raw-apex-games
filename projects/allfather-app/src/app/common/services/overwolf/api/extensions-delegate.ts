import { Subject } from "rxjs";
import { OWAppLaunchTriggeredEvent } from "../types/overwolf-types";
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

    private onAppLaunchTriggered(appLaunchTriggeredEvent: overwolf.extensions.AppLaunchTriggeredEvent): void {
        this.appLaunchTriggeredEvent$.next(appLaunchTriggeredEvent as OWAppLaunchTriggeredEvent);
    }
}
