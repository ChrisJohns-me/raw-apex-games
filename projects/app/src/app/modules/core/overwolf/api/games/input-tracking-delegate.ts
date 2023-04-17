import { Observable, Subject, bindCallback, filter, map } from "rxjs";
import { OWInputActivity, OWMouseEvent, OWMousePosition } from "../../types/overwolf-types";

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

    public getMousePosition(): Observable<OWMousePosition> {
        const getMousePositionObs = bindCallback(overwolf.games.inputTracking.getMousePosition);
        return getMousePositionObs().pipe(
            filter((result) => !!result?.success && !!result?.mousePosition),
            map((result) => result.mousePosition!)
        );
    }

    public getActivityInformation(): Observable<OWInputActivity> {
        const getActivityInformationObs = bindCallback(overwolf.games.inputTracking.getActivityInformation);
        return getActivityInformationObs().pipe(
            filter((result) => !!result?.success && !!result.activity),
            map((result) => result.activity!)
        );
    }

    private onMouseDown(event: OWMouseEvent): void {
        this.mouseDown$.next(event);
    }

    private onMouseUp(event: OWMouseEvent): void {
        this.mouseUp$.next(event);
    }
}
