import { UIWindow, WindowState } from "@allfather-app/app/common/ui-window";
import { Observable, of } from "rxjs";

export class MockUIWindow implements MockedClass<UIWindow> {
    public name = "";

    public assureObtained(): Observable<void> {
        return of();
    }
    public windowInfo(): Observable<overwolf.windows.WindowInfo> {
        return of();
    }
    public minimize(): Observable<void> {
        return of();
    }
    public maximize(): Observable<void> {
        return of();
    }
    public restore(): Observable<void> {
        return of();
    }
    public close(): Observable<void> {
        return of();
    }
    public toggleMinimize(close?: boolean): Observable<boolean> {
        return of();
    }
    public toggleMaximize(): Observable<boolean> {
        return of();
    }
    public dragMove(): void {
        throw new Error("Method not implemented.");
    }
    public changeSize(width: number, height: number): Observable<void> {
        throw new Error("Method not implemented.");
    }
    public setMinSize(width: number, height: number): Observable<void> {
        throw new Error("Method not implemented.");
    }
    public changePosition(left: number, top: number): Observable<void> {
        throw new Error("Method not implemented.");
    }
    public bringToFront(grabFocus?: boolean): Observable<void> {
        throw new Error("Method not implemented.");
    }
    public sendToBack(): Observable<void> {
        return of();
    }
    public getState(): Observable<WindowState> {
        return of();
    }
    public getSize(): Observable<{ height: number; width: number }> {
        return of();
    }
    public getMonitor(): Observable<overwolf.utils.Display> {
        return of();
    }
    public getPosition(): Observable<{ top: number; right: number }> {
        return of();
    }
}
