import { Subject } from "rxjs";
import { OWMouseEvent } from "../../types/overwolf-types";

export class InputTrackingDelegate {
    public readonly mouseDown$ = new Subject<OWMouseEvent>();
    public readonly mouseUp$ = new Subject<OWMouseEvent>();

    public eventListeners = {
        MOUSEDOWN: this.onMouseDown,
        MOUSEUP: this.onMouseUp,
    };

    public startEventListeners(): void {
        this.stopEventListeners();
        overwolf.games.inputTracking.onMouseDown.addListener(this.eventListeners.MOUSEDOWN.bind(this));
        overwolf.games.inputTracking.onMouseUp.addListener(this.eventListeners.MOUSEUP.bind(this));
    }

    public stopEventListeners(): void {
        overwolf.games.inputTracking.onMouseDown.removeListener(this.eventListeners.MOUSEDOWN.bind(this));
        overwolf.games.inputTracking.onMouseUp.removeListener(this.eventListeners.MOUSEUP.bind(this));
    }

    private onMouseDown(event: OWMouseEvent): void {
        this.mouseDown$.next(event);
    }

    private onMouseUp(event: OWMouseEvent): void {
        this.mouseUp$.next(event);
    }
}
