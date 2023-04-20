import { OWDisplay, OWWindowInfo } from "@app/modules/core/overwolf/types/overwolf-types.js";
import { combineLatest, from, Observable, of } from "rxjs";
import { filter, map, mergeMap, switchMap } from "rxjs/operators";

type WindowIdResultCallback = overwolf.CallbackFunction<overwolf.windows.WindowIdResult>;
type MessageBoxParams = overwolf.windows.MessageBoxParams;

interface DisplayMessageBoxConfirmedEvent {
    success: boolean;
    confirmed: boolean;
    error: string;
}

export enum OverwolfWindowState {
    Closed = "closed",
    Maximized = "maximized",
    Minimized = "minimized",
    Hidden = "hidden",
    Normal = "normal",
}

export enum OverwolfWindowName {
    Background = "background",
    DevelopmentTools = "development-tools",
    HUDMiniInventory = "hud-mini-inventory",
    Desktop = "desktop",
    InGame = "ingame",
}

export class OverwolfWindow {
    constructor(public name: string = "") {}

    public static getMainWindow(): Window {
        return overwolf.windows.getMainWindow();
    }

    public static getCurrentWindow(): Observable<OWWindowInfo> {
        const promise = new Promise<OWWindowInfo>((resolve, reject) => {
            overwolf.windows.getCurrentWindow((result?) => {
                if (result?.success) {
                    resolve(result.window);
                } else {
                    reject(`Could not get current window. reason: ${result.error ?? JSON.stringify(result)}.`);
                }
            });
        });
        return from(promise);
    }

    public static getMonitors(): Observable<OWDisplay[]> {
        const promise = new Promise<OWDisplay[]>((resolve, reject) => {
            overwolf.utils.getMonitorsList((result?) => {
                if (result && result.displays && Array.isArray(result.displays)) {
                    resolve(result.displays);
                } else {
                    reject(`Could not get current window. reason: ${(result as any)?.error ?? JSON.stringify(result)}.`);
                }
            });
        });
        return from(promise);
    }

    public static displayMessageBox(params: MessageBoxParams): Observable<boolean> {
        const promise = new Promise<boolean>((resolve, reject) => {
            overwolf.windows.displayMessageBox(params, (result?) => {
                const event: DisplayMessageBoxConfirmedEvent = result as any;
                if (event?.success) {
                    resolve(event.confirmed);
                } else {
                    reject(event.error);
                }
            });
        });
        return from(promise);
    }

    public assureObtained(): Observable<void> {
        return this.obtain().pipe(map(() => undefined));
    }

    public windowInfo(): Observable<OWWindowInfo> {
        return this.obtain();
    }

    public minimize(): Observable<void> {
        return this.obtain().pipe(mergeMap((window) => this.minimizeInternal(window.id)));
    }

    public maximize(): Observable<void> {
        return this.obtain().pipe(mergeMap((window) => this.maximizeInternal(window.id)));
    }

    public restore(): Observable<void> {
        return this.obtain().pipe(mergeMap((window) => this.restoreInternal(window.id)));
    }

    public close(): Observable<void> {
        return this.obtain().pipe(mergeMap((window) => this.closeInternal(window.id)));
    }

    /**
     * Toggles between minimized and normal state.
     * @param {boolean} close - if true, will close the window instead of minimizing it.
     * @returns {true} if restored
     * @returns {false} if closed
     */
    public toggleMinimize(close = false): Observable<boolean> {
        return this.obtain().pipe(
            mergeMap((window) => this.getStateInternal(window.id)),
            mergeMap((state) => {
                if (state === OverwolfWindowState.Closed || state === OverwolfWindowState.Minimized) {
                    return this.restore().pipe(map(() => true));
                }
                return (close ? this.close() : this.minimize()).pipe(map(() => false));
            })
        );
    }

    /**
     * Toggles between maximized and normal state.
     * @returns {true} if set to maximized
     * @returns {false} if set to non-maximized
     */
    public toggleMaximize(): Observable<boolean> {
        return this.obtain().pipe(
            mergeMap((window) => this.getStateInternal(window.id)),
            mergeMap((state) => {
                if (state === OverwolfWindowState.Closed || state === OverwolfWindowState.Maximized) {
                    return this.restore().pipe(map(() => false));
                } else {
                    return this.maximize().pipe(map(() => true));
                }
            })
        );
    }

    public dragMove(): void {
        overwolf.windows.dragMove(this.name);
    }

    /** Accounts for DPI */
    public changeSize(width: number, height: number): Observable<void> {
        const promise = new Promise<void>((resolve, reject) => {
            if (!this.name) return reject(`Unable to change window size; OverwolfWindow name was empty`);

            const sizeSettings: overwolf.windows.ChangeWindowSizeParams = {
                window_id: this.name,
                width: Math.round(width),
                height: Math.round(height),
            };

            overwolf.windows.changeSize(sizeSettings, (result) => {
                if (result.success) {
                    resolve();
                } else {
                    reject(`OverwolfWindow.changeSize() error: ${result.error}`);
                }
            });
        });
        return from(promise);
    }

    public setMinSize(width: number, height: number): Observable<void> {
        const promise = new Promise<void>((resolve, reject) => {
            overwolf.windows.setMinSize(this.name, Math.round(width), Math.round(height), (result) => {
                if (result.success) {
                    resolve();
                } else {
                    reject(result.error);
                }
            });
        });
        return from(promise);
    }

    public changePosition(left: number, top: number): Observable<void> {
        const promise = new Promise<void>((resolve, reject) => {
            if (!this.name) return reject(`Unable to change window size; OverwolfWindow name was empty`);
            overwolf.windows.changePosition(this.name, Math.round(left), Math.round(top), (result) => {
                if (result.success) {
                    resolve();
                } else {
                    reject(`OverwolfWindow.changePosition() error: ${result.error}`);
                    reject(result.error);
                }
            });
        });
        return from(promise);
    }

    public bringToFront(grabFocus = false): Observable<void> {
        return this.obtain().pipe(mergeMap((window) => this.bringToFrontInternal(window.id, grabFocus)));
    }

    public sendToBack(): Observable<void> {
        return this.obtain().pipe(mergeMap((window) => this.sendToBackInternal(window.id)));
    }

    public getState(): Observable<OverwolfWindowState> {
        return this.obtain().pipe(mergeMap((window) => this.getStateInternal(window.id)));
    }

    public getSize(): Observable<{ height: number; width: number }> {
        return this.obtain().pipe(map((window) => ({ height: window.height, width: window.width })));
    }

    public getMonitor(): Observable<OWDisplay> {
        return this.obtain().pipe(
            switchMap((window) => combineLatest([of(window), OverwolfWindow.getMonitors()])),
            map(([window, monitors]) => monitors.find((m) => m.id === window.monitorId)),
            filter((monitor) => !!monitor)
        ) as Observable<OWDisplay>;
    }

    public getPosition(): Observable<{ top: number; right: number }> {
        return this.obtain().pipe(map((window) => ({ top: window.top, right: window.left })));
    }

    public isWindowVisibleToUser(): Observable<"hidden" | "full" | "partial"> {
        const promise = new Promise<"hidden" | "full" | "partial">((resolve, reject) => {
            overwolf.windows.isWindowVisibleToUser((result) => {
                if (result.success) {
                    resolve(result.visible);
                } else {
                    reject(`OverwolfWindow.isWindowVisibleToUser() error: ${result.error}`);
                    reject(result.error);
                }
            });
        });
        return from(promise);
    }

    /** Internal methods */
    private obtain(): Observable<OWWindowInfo> {
        const promise = new Promise<OWWindowInfo>((resolve, reject) => {
            const process = (result: overwolf.windows.WindowResult): void => {
                if (result.success && result.window) {
                    this.name = result.window.name;
                    resolve(result.window);
                } else {
                    reject(result.error);
                }
            };
            if (this.name) {
                overwolf.windows.obtainDeclaredWindow(this.name, process);
            } else {
                console.warn(`No window name, obtaining current window`);
                overwolf.windows.getCurrentWindow(process);
            }
        });
        return from(promise);
    }

    private minimizeInternal(id: string): Observable<void> {
        const promise = new Promise<void>((resolve, reject) => {
            overwolf.windows.minimize(id, resultCallback(resolve, reject));
        });
        return from(promise);
    }

    private maximizeInternal(id: string): Observable<void> {
        const promise = new Promise<void>((resolve, reject) => {
            overwolf.windows.maximize(id, resultCallback(resolve, reject));
        });
        return from(promise);
    }

    private restoreInternal(id: string): Observable<void> {
        const promise = new Promise<void>((resolve, reject) => {
            overwolf.windows.restore(id, resultCallback(resolve, reject));
        });
        return from(promise);
    }

    private closeInternal(id: string): Observable<void> {
        const promise = new Promise<void>((resolve, reject) => {
            overwolf.windows.close(id, resultCallback(resolve, reject));
        });
        return from(promise);
    }

    private bringToFrontInternal(id: string, grabFocus: boolean): Observable<void> {
        const promise = new Promise<void>((resolve, reject) => {
            overwolf.windows.bringToFront(id, grabFocus, resultCallback(resolve, reject));
        });
        return from(promise);
    }

    private sendToBackInternal(id: string): Observable<void> {
        const promise = new Promise<void>((resolve, reject) => {
            overwolf.windows.sendToBack(id, resultCallback(resolve, reject));
        });
        return from(promise);
    }

    private getStateInternal(id: string): Observable<OverwolfWindowState> {
        const promise = new Promise<OverwolfWindowState>((resolve, reject) => {
            overwolf.windows.getWindowState(id, (result) => {
                if (result.success) {
                    resolve(result.window_state as OverwolfWindowState);
                } else {
                    reject(result.error);
                }
            });
        });
        return from(promise);
    }
}

function resultCallback(resolve: () => void, reject: (reason?: any) => void): WindowIdResultCallback {
    return (result?) => {
        if (result?.success) {
            resolve();
        } else {
            reject(result.error);
        }
    };
}
