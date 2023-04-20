/**
overwolf.windows.dragResize()
overwolf.windows.changeSize()
overwolf.windows.setMinSize()
 */

import { Observable, of } from "rxjs";

/**
 * Anything to do with width, height, dragging-width, dragging-height
 */
export class SizeDelegate {
    public dragResize(): Observable<void> {
        return of();
        // overwolf.windows.dragResize
    }

    public changeSize(): Observable<void> {
        return of();
        // overwolf.windows.changeSize
    }

    public setMinSize(): Observable<void> {
        return of();
        // overwolf.windows.setMinSize
    }
}
