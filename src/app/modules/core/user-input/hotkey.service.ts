import { Injectable, OnDestroy } from "@angular/core";
import { GameClassId } from "@common/game";
import { from, Observable, Subject } from "rxjs";
import { filter, map } from "rxjs/operators";
import { HotkeyName } from "./hotkey-name";

export type HotkeyData = overwolf.settings.hotkeys.IHotkey;

@Injectable({
    providedIn: "root",
})
export class HotkeyService implements OnDestroy {
    public hotkeyPressedEvent$: Observable<HotkeyName>;

    private readonly _hotkeyPressed = new Subject<HotkeyName>();
    private readonly _unsubscribe = new Subject<void>();

    constructor() {
        console.debug(`${this.constructor.name} instantiated`);
        this.hotkeyPressedEvent$ = this._hotkeyPressed;
        this.registerEvents();
    }

    public ngOnDestroy(): void {
        this.unregisterEvents();
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public static getHotkeyData(): Observable<HotkeyData[]> {
        type GetAssignedHotkeyResult = overwolf.settings.hotkeys.GetAssignedHotkeyResult;

        const promise = new Promise<GetAssignedHotkeyResult>((resolve, reject) => {
            overwolf.settings.hotkeys.get((result?) => {
                if (result?.success) {
                    resolve(result);
                } else {
                    reject(result.error);
                }
            });
        });

        return from(promise).pipe(
            filter((result) => !!Object.keys(result?.games ?? []).length),
            map((result) => result.games?.[GameClassId.ApexLegends] ?? [])
        );
    }

    private onPressed(event: overwolf.settings.hotkeys.OnPressedEvent): void {
        this._hotkeyPressed.next(event.name as HotkeyName);
    }

    private registerEvents(): void {
        overwolf.settings.hotkeys.onPressed.addListener((event) => this.onPressed(event));
    }

    private unregisterEvents(): void {
        overwolf.settings.hotkeys.onPressed.removeListener((event) => this.onPressed(event));
    }
}
