import { environment } from "@app/../environments/environment.js";
import { OwAd } from "@overwolf/types/owads.js";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { OverwolfWindowName } from "./overwolf-window.js";

const OVERWOLF_SCRIPT = "https://content.overwolf.com/libs/ads/latest/owads.min.js";

type AdvertisementConstructor = {
    adHTMLElement: HTMLElement;
    overwolfWindowName: OverwolfWindowName;
    overwolfWindowStateChangedEvent: Subject<overwolf.windows.WindowStateChangedEvent>;
    windowObj: Window;
};

export class Advertisement {
    public impression$ = new BehaviorSubject<boolean>(false);
    public playerLoaded$ = new BehaviorSubject<boolean>(false);
    public displayAdLoaded$ = new BehaviorSubject<boolean>(false);
    public play$ = new BehaviorSubject<boolean>(false);
    public complete$ = new BehaviorSubject<boolean>(false);
    public owInternalRendered$ = new BehaviorSubject<boolean>(false);
    public error$ = new Subject<any>();

    private adHTMLElement: HTMLElement;
    private overwolfAdInstance?: OwAd;
    private windowObj: Window;

    constructor(ctor: AdvertisementConstructor) {
        this.windowObj = ctor.windowObj;
        this.adHTMLElement = ctor.adHTMLElement;
        this.devForceOverwolfTestAdUnit();
        this.setupOverwolfAdInstance();
    }

    //#region Setup Methods
    private setupOverwolfAdInstance(): void {
        this.injectOverwolfAdvertisingScript().subscribe(() => {
            this.overwolfAdInstance = new OwAd(this.adHTMLElement, {
                size: [{ width: 300, height: 250 }], // LEFT OFF HERE
            });
        });
    }
    //#endregion

    //#region Destructuring Methods

    //#endregion

    //#region Internal Methods
    private injectOverwolfAdvertisingScript(): Observable<Event> {
        return new Observable((observer) => {
            const scriptElem = this.windowObj.document.createElement("script");
            scriptElem.src = OVERWOLF_SCRIPT;
            scriptElem.async = true;
            scriptElem.onload = (event) => observer.next(event);
            scriptElem.onerror = (err) => observer.error(err);
            document.body.appendChild(scriptElem);
        });
    }
    //#endregion

    /** Forces Overwolf to display a test ad. */
    private devForceOverwolfTestAdUnit(): void {
        if (environment.DEV && environment.testAds) {
            localStorage.setItem("owAdsForceAdUnit", "Ad_test");
        } else {
            localStorage.removeItem("owAdsForceAdUnit");
        }
    }
}
