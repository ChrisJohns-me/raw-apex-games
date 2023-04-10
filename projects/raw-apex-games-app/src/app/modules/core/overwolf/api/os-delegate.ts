import { bindCallback, Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";

export class OSDelegate {
    public readonly systemTrayIconClicked$ = new Subject<void>();
    public readonly systemTrayIconDoubleClicked$ = new Subject<void>();
    public readonly menuItemClicked$ = new Subject<string>();

    public eventListeners = {
        TRAYICONCLICKED: this.onTrayIconClicked,
        TRAYICONDOUBLECLICKED: this.onTrayIconDoubleClicked,
        MENUITEMCLICKED: (e: overwolf.os.tray.onMenuItemClickedEvent): void => this.onMenuItemClicked(e),
    };

    /**
     * Creates the system tray icon
     * @param trayMenu
     * @returns {true} if successful
     * @returns {error} if failed
     */
    public setMenu(trayMenu: overwolf.os.tray.ExtensionTrayMenu): Observable<true> {
        const setMenuObs = bindCallback(overwolf.os.tray.setMenu);
        return setMenuObs(trayMenu).pipe(
            map((result) => {
                if (result?.success) return true;
                else throw new Error(result?.error || (result as any)?.reason);
            })
        );
    }

    public startEventListeners(): void {
        this.stopEventListeners();
        overwolf.os.tray.onMenuItemClicked.addListener(this.eventListeners.MENUITEMCLICKED.bind(this));
        overwolf.os.tray.onTrayIconClicked.addListener(this.eventListeners.TRAYICONCLICKED.bind(this));
        overwolf.os.tray.onTrayIconDoubleClicked.addListener(this.eventListeners.TRAYICONDOUBLECLICKED.bind(this));
    }

    public stopEventListeners(): void {
        overwolf.os.tray.onMenuItemClicked.removeListener(this.eventListeners.MENUITEMCLICKED.bind(this));
        overwolf.os.tray.onTrayIconClicked.removeListener(this.eventListeners.TRAYICONCLICKED.bind(this));
        overwolf.os.tray.onTrayIconDoubleClicked.removeListener(this.eventListeners.TRAYICONDOUBLECLICKED.bind(this));
    }

    /**
     * System tray icon was clicked
     */
    private onTrayIconClicked(): void {
        this.systemTrayIconClicked$.next();
    }

    /**
     * System tray icon was double clicked
     */
    private onTrayIconDoubleClicked(): void {
        this.systemTrayIconDoubleClicked$.next();
    }

    /**
     * System tray menu item was clicked
     */
    private onMenuItemClicked(menuItem?: { item?: string }): void {
        if (!menuItem?.item?.length) return;
        this.menuItemClicked$.next(menuItem.item);
    }
}
