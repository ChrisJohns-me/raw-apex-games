import { bindCallback, Observable } from "rxjs";
import { map } from "rxjs/operators";

export class InstancesDelegate {
    /**
     * This function allows you to get direct access to your main index page (which should
     * be a controller/background page) and it’s HTML Window object (and thus any JS
     * function or DOM element), which is also guaranteed to exist when calling this method from any other window
     * @returns Window
     */
    public getMainWindow(): Window {
        return overwolf.windows.getMainWindow();
    }

    /**
     * @returns Current window object
     */
    public getCurrentWindow(): Observable<overwolf.windows.WindowInfo> {
        const getGetCurrentWindowObs = bindCallback(overwolf.windows.getCurrentWindow);
        return getGetCurrentWindowObs().pipe(
            map((result) => {
                if (result?.success) return result.window;
                else throw new Error(result?.error);
            })
        );
    }

    /**
     * Returns an array of all open windows as objects. The objects can be manipulated like any other window.
     * * Do not use for windows communication.
     * @returns a map object of window-name, Window Object items
     */
    public getOpenWindows(): Observable<Record<string, Window>> {
        const getGetOpenWindowsObs = bindCallback(overwolf.windows.getOpenWindows);
        return getGetOpenWindowsObs().pipe(
            map((result) => {
                if (result?.success) return result;
                else throw new Error(`Unable to retrieve open windows`);
            })
        );
    }

    /**
     * Creates an instance of your window (the window’s name has to be declared in the manifest.json) or returns a window by the window name.
     * @param windowName The name of the window that was declared in the data.windows section in the manifest
     * @param useDefaultSizeAndLocation Enable the manifest size and position settings
     */
    public obtainDeclaredWindow(
        windowName: string,
        useDefaultSizeAndLocation: overwolf.windows.DefaultSizeAndLocation
    ): Observable<overwolf.windows.WindowInfo> {
        type ObtainDeclaredWindowFn = (
            windowName: string,
            useDefaultSizeAndLocation: overwolf.windows.DefaultSizeAndLocation,
            callback: overwolf.CallbackFunction<overwolf.windows.WindowResult>
        ) => void;
        const getObtainDeclaredWindowObs = bindCallback(overwolf.windows.obtainDeclaredWindow as ObtainDeclaredWindowFn);
        return getObtainDeclaredWindowObs(windowName, useDefaultSizeAndLocation).pipe(
            map((result) => {
                if (result?.success) return result.window;
                else throw new Error(result?.error);
            })
        );
    }
}
