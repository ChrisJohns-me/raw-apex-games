import { Injectable, OnDestroy } from "@angular/core";
import { Observable, Subject } from "rxjs";

export type UIWindowStateChangedEvent = overwolf.windows.WindowStateChangedEvent;

@Injectable({
    providedIn: "root",
})
export class UIWindowEventsService implements OnDestroy {
    public windowStateChangedEvent$: Observable<UIWindowStateChangedEvent>;

    private readonly _windowStateChangedEvent = new Subject<UIWindowStateChangedEvent>();

    constructor() {
        console.debug(`${this.constructor.name}:${this.__$id()} instantiated`);
        this.windowStateChangedEvent$ = this._windowStateChangedEvent;
        this.registerEvents();
    }

    public ngOnDestroy(): void {
        console.debug(`${this.constructor.name}:${this.__$id()} destroyed`);
        this.unregisterEvents();
    }

    private onStateChange(
        event: overwolf.windows.WindowStateChangedEvent
    ): void {
        console.debug(`${this.constructor.name}:${this.__$id()} onStateChange`);
        this._windowStateChangedEvent.next(event);
    }

    private registerEvents(): void {
        console.debug(
            `${this.constructor.name}:${this.__$id()} registerEvents`
        );
        overwolf.windows.onStateChanged.addListener((event) =>
            this.onStateChange(event)
        );
    }

    private unregisterEvents(): void {
        console.debug(
            `${this.constructor.name}:${this.__$id()} unregisterEvents`
        );
        overwolf.windows.onStateChanged.removeListener((event) =>
            this.onStateChange(event)
        );
    }
}
