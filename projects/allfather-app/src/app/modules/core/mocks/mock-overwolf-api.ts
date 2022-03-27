import { OverwolfConfig } from "@allfather-app/app/common/services/overwolf/overwolf-config";
import { createOverwolfObj } from "@allfather-app/app/common/testing-helpers";

type CallbackFn = (...args: any[]) => void;
type OverwolfObj = typeof overwolf;

/**
 * Installs a Jasmine spy to emulate the Overwolf API.
 * Test will freeze if any method is unmocked
 */
export class MockOverwolfAPI {
    public get isInstalled(): boolean {
        try {
            return !!(overwolf as any).__mockInstallationCheck;
        } catch (error) {
            console.error(`MockOverwolfAPI is not installed`);
            return false;
        }
    }

    public mockUIWindowName = "mock";
    public mockMonitorID = "mock";
    public setRequiredFeaturesShouldFail = false;
    public getRunningGameInfoShouldFail = false;
    public runningGameInfo: overwolf.games.RunningGameInfo = {
        allowsVideoCapture: true,
        classId: OverwolfConfig.APEXLEGENDSCLASSID,
        commandLine: `"C:/Program Files (x86)/Steam/steamapps/common/Apex Legends/R5Apex.exe" -steam -dev -eac_executablename "R5Apex.exe"`,
        detectedRenderer: "D3D11",
        displayName: "",
        executionPath: `C:/Program Files (x86)/Steam/steamapps/common/Apex Legends/R5Apex.exe`,
        height: 1440,
        id: 215661,
        isInFocus: true,
        isRunning: true,
        logicalHeight: 1440,
        logicalWidth: 2560,
        monitorHandle: { value: 65537 },
        processId: 1234,
        renderers: ["D3D11"],
        sessionId: "6c927590a6754d8d8e03dce0f420a86d",
        shortTitle: "",
        title: "Apex Legends",
        type: 0,
        typeAsString: "Game",
        width: 2560,
        windowHandle: {
            value: 25103108,
        },
    };

    /**
     * Callback methods that have tapped into and are listening to a method.
     * Typically for validation purposes
     */
    private methodListeners: Array<[path: string, callbackFn: CallbackFn]> = [];

    /**
     * Available internal method callbacks. Used by the trigger method to emulate an Overwolf API event.
     */
    private methodTriggers: Array<[path: string, callbackFn: CallbackFn]> = [];

    constructor(autoInstall = false) {
        if (autoInstall) this.install();
    }

    public install(): void {
        const overwolfObj: Partial<OverwolfObj> = {
            extensions: this.createExtensions() as OverwolfObj["extensions"],
            games: this.createGames() as OverwolfObj["games"],
            utils: this.createUtils() as OverwolfObj["utils"],
            windows: this.createWindows() as OverwolfObj["windows"],
        };
        (overwolfObj as any)["__mockInstallationCheck"] = true;
        createOverwolfObj("", overwolfObj);
        console.warn(`MOCKED OVERWOLF API INSTALLED`);

        // const owObjPath = "overwolf";
        // const spyObj = jasmine.createSpyObj(baseName, owMethodNames);
        // const spiedObj = createOverwolfObj(owObjPath, spyObj);
        // globalThis.overwolf = overwolfObj as OverwolfObj;
        // const overwolfSpy = spyOnAllFunctions(globalThis.overwolf);
    }

    /**
     * Trigger an event or function on Overwolf's API to be called.
     * @param path exact path of the method name; ex. "overwolf.games.events.onInfoUpdates2"
     */
    public triggerMethod(path: string, data?: any): void {
        const foundMethodTrigger = this.methodTriggers.find((t) => t[0] === path);
        if (!foundMethodTrigger) {
            console.warn(`[Mock Overwolf API] Triggered a method "${path}", which has no listeners`);
        }
        foundMethodTrigger?.[1](data);
    }

    /**
     * Listen for when Overwolf API methods are called. Typically for validation.
     * @param path exact path of the method name; ex. "overwolf.games.events.onInfoUpdates2"
     * @param callbackFn callback function when the path method is called
     */
    public addMethodListener(path: string, callbackFn: CallbackFn): void {
        this.methodListeners.push([path, callbackFn]);
    }

    public removeMethodListener(path: string, callbackFn: CallbackFn): void {
        this.methodListeners = this.methodListeners.filter((l) => l[0] !== path && l[1] !== callbackFn);
    }

    private methodCalled(path: string): void {
        this.methodListeners
            .filter((m) => m[0] === path)
            .forEach(([, callbackFn]) => {
                if (typeof callbackFn === "function") callbackFn();
            });
    }

    // Overwolf Object Categories
    private createExtensions(): Partial<OverwolfObj["extensions"]> {
        return {
            relaunch: () => {
                this.methodCalled("overwolf.extensions.relaunch");
            },
        } as Partial<OverwolfObj["extensions"]>;
    }

    private createGames(): Partial<OverwolfObj["games"]> {
        return {
            events: {
                getInfo: (callbackFn: overwolf.CallbackFunction<overwolf.games.events.GetInfoResult>): void => {},
                onError: {
                    addListener: (callbackFn: CallbackFn) => {
                        const path = "overwolf.games.events.onInfoUpdates2";
                        console.log(`[MOCKOVERWOLFAPI] Adding listener for "addListener" on path "${path}"`);
                        this.methodTriggers.push([path, callbackFn]);
                        this.methodCalled(path + ".addListener");
                    },
                    removeListener: (callbackFn: CallbackFn) => {
                        const path = "overwolf.games.events.onInfoUpdates2";
                        console.log(`[MOCKOVERWOLFAPI] Removing listener for "removeListener" on path "${path}"`);
                        this.methodTriggers = this.methodTriggers.filter((t) => t[0] === path && t[1] == callbackFn);
                        this.methodCalled(path + ".removeListener");
                    },
                },
                onInfoUpdates: {
                    addListener: (callbackFn: CallbackFn) => {
                        const path = "overwolf.games.events.onInfoUpdates";
                        console.log(`[MOCKOVERWOLFAPI] Adding listener for "addListener" on path "${path}"`);
                        this.methodTriggers.push([path, callbackFn]);
                        this.methodCalled(path + ".addListener");
                    },
                    removeListener: (callbackFn: CallbackFn) => {
                        const path = "overwolf.games.events.onInfoUpdates";
                        console.log(`[MOCKOVERWOLFAPI] Removing listener for "removeListener" on path "${path}"`);
                        this.methodTriggers = this.methodTriggers.filter((t) => t[0] === path && t[1] == callbackFn);
                        this.methodCalled(path + ".removeListener");
                    },
                },
                onInfoUpdates2: {
                    addListener: (callbackFn: CallbackFn) => {
                        const path = "overwolf.games.events.onInfoUpdates2";
                        console.log(`[MOCKOVERWOLFAPI] Adding listener for "addListener" on path "${path}"`);
                        this.methodTriggers.push([path, callbackFn]);
                        this.methodCalled(path + ".addListener");
                    },
                    removeListener: (callbackFn: CallbackFn) => {
                        const path = "overwolf.games.events.onInfoUpdates2";
                        console.log(`[MOCKOVERWOLFAPI] Removing listener for "removeListener" on path "${path}"`);
                        this.methodTriggers = this.methodTriggers.filter((t) => t[0] === path && t[1] == callbackFn);
                        this.methodCalled(path + ".removeListener");
                    },
                },
                onNewEvents: {
                    addListener: (callbackFn: CallbackFn) => {
                        const path = "overwolf.games.events.onNewEvents";
                        this.methodTriggers.push([path, callbackFn]);
                        this.methodCalled(path + ".addListener");
                    },
                    removeListener: (callbackFn: CallbackFn) => {
                        const path = "overwolf.games.events.onNewEvents";
                        this.methodTriggers = this.methodTriggers.filter((t) => t[0] === path && t[1] == callbackFn);
                        this.methodCalled(path + ".removeListener");
                    },
                },
                onNewEvent2: {
                    addListener: (callbackFn: CallbackFn) => {
                        const path = "overwolf.games.events.onNewEvent2";
                        this.methodTriggers.push([path, callbackFn]);
                        this.methodCalled(path + ".addListener");
                    },
                    removeListener: (callbackFn: CallbackFn) => {
                        const path = "overwolf.games.events.onNewEvent2";
                        this.methodTriggers = this.methodTriggers.filter((t) => t[0] === path && t[1] == callbackFn);
                        this.methodCalled(path + ".removeListener");
                    },
                },
                setRequiredFeatures: (
                    features: string[],
                    callbackFn: (result: overwolf.games.events.SetRequiredFeaturesResult) => void
                ): void => {
                    const path = "overwolf.games.events.setRequiredFeatures";
                    this.methodTriggers.push([path, callbackFn]);
                    if (this.setRequiredFeaturesShouldFail) {
                        this.methodCalled(path);
                        return callbackFn({ success: false });
                    } else {
                        this.methodCalled(path);
                        return callbackFn({
                            success: true,
                            supportedFeatures: features,
                        });
                    }
                },
                provider: {
                    setSupportedFeatures: (features: string[], callback: overwolf.CallbackFunction<overwolf.Result>) => {},
                    triggerEvent: (feature: string, name: string, data?: any) => {},
                    updateInfo: (info: overwolf.games.events.provider.GameEventsInfo) => {},
                },
            },
            getRunningGameInfo: (callbackFn: CallbackFn) => {
                const path = "overwolf.games.events.getRunningGameInfo";
                if (this.getRunningGameInfoShouldFail) {
                    this.methodCalled(path);
                    return callbackFn(null);
                } else {
                    this.methodCalled(path);
                    return callbackFn(this.runningGameInfo);
                }
            },
            onGameInfoUpdated: {
                addListener: (callbackFn: CallbackFn) => {
                    const path = "overwolf.games.events.onGameInfoUpdated";
                    this.methodTriggers.push([path, callbackFn]);
                    this.methodCalled(path + ".addListener");
                },
                removeListener: (callbackFn: CallbackFn) => {
                    const path = "overwolf.games.events.onGameInfoUpdated";
                    this.methodTriggers = this.methodTriggers.filter((t) => t[0] === path && t[1] == callbackFn);
                    this.methodCalled(path + ".removeListener");
                },
            },
        } as Partial<OverwolfObj["games"]>;
    }

    private createUtils(): Partial<OverwolfObj["utils"]> {
        return {
            getMonitorsList: (callbackFn: overwolf.CallbackFunction<overwolf.utils.getMonitorsListResult>) => {
                callbackFn({
                    displays: [
                        {
                            name: "",
                            id: "",
                            x: 0,
                            y: 0,
                            dpiX: 0,
                            dpiY: 0,
                            width: 1,
                            height: 1,
                            is_primary: true,
                            handle: { value: 0 },
                        },
                    ],
                    success: true,
                });
            },
        } as Partial<OverwolfObj["utils"]>;
    }

    private createWindows(): Partial<OverwolfObj["windows"]> {
        const windowInfo: overwolf.windows.WindowInfo = {
            name: this.mockUIWindowName,
            id: `Window_Extension_abc123_${this.mockUIWindowName}`,
            state: "active",
            stateEx: "normal" as overwolf.windows.WindowStateEx,
            isVisible: true,
            left: 0,
            top: 0,
            width: 1,
            height: 1,
            monitorId: this.mockMonitorID,
        };

        return {
            changePosition: (
                windowId: string,
                left: number,
                top: number,
                callbackFn?: overwolf.CallbackFunction<overwolf.windows.WindowIdResult>
            ): void => {
                if (typeof callbackFn === "function")
                    callbackFn({
                        window_id: windowId,
                        success: true,
                    });
            },
            dragResize: (windowId: string, edge: overwolf.windows.enums.WindowDragEdge): void => {},
            getMainWindow: (): Window => {
                return window;
            },
            getCurrentWindow: (callbackFn: overwolf.CallbackFunction<overwolf.windows.WindowResult>): void => {
                callbackFn({
                    window: { ...windowInfo, name: this.mockUIWindowName },
                    success: true,
                });
            },
            obtainDeclaredWindow: (windowName: string, callbackFn: overwolf.CallbackFunction<overwolf.windows.WindowResult>): void => {
                callbackFn({
                    window: { ...windowInfo, name: windowName },
                    success: true,
                });
            },
            close: (windowId: string, callbackFn?: overwolf.CallbackFunction<overwolf.windows.WindowIdResult>) => {
                if (typeof callbackFn === "function") callbackFn({ window_id: windowId, success: true });
            },
            hide: (windowId: string, callbackFn?: overwolf.CallbackFunction<overwolf.windows.WindowIdResult>) => {
                if (typeof callbackFn === "function") callbackFn({ window_id: windowId, success: true });
            },
            minimize: (windowId: string, callbackFn?: overwolf.CallbackFunction<overwolf.windows.WindowIdResult>) => {
                if (typeof callbackFn === "function") callbackFn({ window_id: windowId, success: true });
            },
            maximize: (windowId: string, callbackFn?: overwolf.CallbackFunction<overwolf.windows.WindowIdResult>) => {
                if (typeof callbackFn === "function") callbackFn({ window_id: windowId, success: true });
            },
            restore: (windowId: string, callbackFn?: overwolf.CallbackFunction<overwolf.windows.WindowIdResult>) => {
                if (typeof callbackFn === "function") callbackFn({ window_id: windowId, success: true });
            },
            bringToFront: (windowId: string, callbackFn?: overwolf.CallbackFunction<overwolf.windows.WindowIdResult>) => {
                if (typeof callbackFn === "function") callbackFn({ window_id: windowId, success: true });
            },
            getWindowState: (windowId: string, callbackFn?: overwolf.CallbackFunction<overwolf.windows.GetWindowStateResult>) => {
                if (typeof callbackFn === "function")
                    callbackFn({
                        window_id: windowId,
                        window_state: "",
                        window_state_ex: "normal" as overwolf.windows.WindowStateEx,
                        success: true,
                    });
            },
        } as Partial<OverwolfObj["windows"]>;
    }
}
