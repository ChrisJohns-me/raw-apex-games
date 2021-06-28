import { combineLatest, from, Observable, of } from "rxjs";
import { filter, map, mergeMap, switchMap } from "rxjs/operators";

export type MonitorDisplay = overwolf.utils.Display;
export type UIWindowInfo = overwolf.windows.WindowInfo;
type WindowIdResultCallback = overwolf.CallbackFunction<overwolf.windows.WindowIdResult>;
type MessageBoxParams = overwolf.windows.MessageBoxParams;

function resultCallback(resolve: () => void, reject: (reason?: any) => void): WindowIdResultCallback {
    return (result?) => {
        if (result?.success) {
            resolve();
        } else {
            reject(result.error);
        }
    };
}

interface DisplayMessageBoxConfirmedEvent {
    success: boolean;
    confirmed: boolean;
    error: string;
}

export enum WindowState {
    Closed = "closed",
    Maximized = "maximized",
    Minimized = "minimized",
    Hidden = "hidden",
    Normal = "normal",
}

export class UIWindow {
    constructor(public name: string = "") {}

    public static getMainWindow(): Window {
        return overwolf.windows.getMainWindow();
    }

    public static getCurrentWindow(): Observable<UIWindowInfo> {
        const promise = new Promise<UIWindowInfo>((resolve, reject) => {
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

    public static getMonitors(): Observable<MonitorDisplay[]> {
        const promise = new Promise<MonitorDisplay[]>((resolve, reject) => {
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

    public windowInfo(): Observable<UIWindowInfo> {
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
     * @returns {true} if restored
     * @returns {false} if closed
     */
    public toggleMinimize(close = false): Observable<boolean> {
        return this.obtain().pipe(
            mergeMap((window) => this.getStateInternal(window.id)),
            mergeMap((state) => {
                if (state === WindowState.Closed || state === WindowState.Minimized) {
                    return this.restore().pipe(map(() => true));
                }
                return (close ? this.close() : this.minimize()).pipe(map(() => false));
            })
        );
    }

    /**
     * @returns {true} if set to maximized
     * @returns {false} if set to non-maximized
     */
    public toggleMaximize(): Observable<boolean> {
        return this.obtain().pipe(
            mergeMap((window) => this.getStateInternal(window.id)),
            mergeMap((state) => {
                if (state === WindowState.Closed || state === WindowState.Maximized) {
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

    public changeSize(width: number, height: number): Observable<void> {
        const promise = new Promise<void>((resolve, reject) => {
            overwolf.windows.changeSize(this.name, Math.round(width), Math.round(height), (result) => {
                if (result.success) {
                    resolve();
                } else {
                    reject(result.error);
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
            overwolf.windows.changePosition(this.name, Math.round(left), Math.round(top), (result) => {
                if (result.success) {
                    resolve();
                } else {
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

    public getState(): Observable<WindowState> {
        return this.obtain().pipe(mergeMap((window) => this.getStateInternal(window.id)));
    }

    public getSize(): Observable<{ height: number; width: number }> {
        return this.obtain().pipe(map((window) => ({ height: window.height, width: window.width })));
    }

    public getMonitor(): Observable<MonitorDisplay> {
        return this.obtain().pipe(
            switchMap((window) => combineLatest([of(window), UIWindow.getMonitors()])),
            map(([window, monitors]) => monitors.find((m) => m.id === window.monitorId)),
            filter((monitor) => !!monitor)
        ) as Observable<MonitorDisplay>;
    }

    public getPosition(): Observable<{ top: number; right: number }> {
        return this.obtain().pipe(map((window) => ({ top: window.top, right: window.left })));
    }

    /** Internal methods */
    private obtain(): Observable<UIWindowInfo> {
        const promise = new Promise<UIWindowInfo>((resolve, reject) => {
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

    private getStateInternal(id: string): Observable<WindowState> {
        const promise = new Promise<WindowState>((resolve, reject) => {
            overwolf.windows.getWindowState(id, (result) => {
                if (result.success) {
                    resolve(result.window_state as WindowState);
                } else {
                    reject(result.error);
                }
            });
        });
        return from(promise);
    }
}
