import { Injectable } from "@angular/core";
import { filter, map, take, takeUntil } from "rxjs/operators";
import { isEmpty } from "../../../../../../common/utilities/";
import { environment } from "../../../environments/environment";
import { aXNWSVA } from "../../common/vip";
import { SingletonServiceProviderFactory } from "../../singleton-service.provider.factory";
import { BaseService } from "./base-service.abstract";
import { OverwolfProfileService } from "./overwolf/overwolf-profile.service";

declare let ga: (...args: any[]) => void;

const TRACK_VIP = environment.DEV;

@Injectable({
    providedIn: "root",
    deps: [OverwolfProfileService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("GoogleAnalyticsService", GoogleAnalyticsService, deps),
})
export class GoogleAnalyticsService extends BaseService {
    /** isVIP */
    private aXNWSVA = false;
    /** username */
    private un?: string;

    constructor(private readonly overwolfProfile: OverwolfProfileService) {
        super();
        if (!this.checkIsInstalled()) return;
        ga("create", environment.gaID, "auto");
        // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
        ga("set", "checkProtocolTask", function () {});
        ga("require", "displayfeatures");

        // Setup VIP
        this.overwolfProfile
            .getCurrentUser()
            .pipe(
                takeUntil(this.destroy$),
                filter((userData) => !isEmpty(userData?.username)),
                map((userData) => userData.username),
                take(1)
            )
            .subscribe((un) => {
                this.aXNWSVA = aXNWSVA(un!);
                this.un = un;
                if (this.aXNWSVA) console.error(`${atob("V2VsY29tZQ==")} ${this.un}`);
                ga("set", "userId", un);
            });
    }

    public sendEvent(eventCategory: string, eventAction: string, eventLabel?: string, eventValue?: number): void {
        if (!this.checkIsInstalled()) return;
        if (this.aXNWSVA && !TRACK_VIP) {
            console.info(`${atob("R0EgU3VwcHJlc3NlZA==")} event; "${eventCategory}", "${eventAction}", "${eventLabel}", "${eventValue}"`);
            return;
        }
        ga("send", "event", eventCategory, eventAction, eventLabel, eventValue);
    }

    /**
     * @param title Page title
     * @param page URI of page (must start with /)
     */
    public sendPageview(title: string, page: string): void {
        if (!this.checkIsInstalled()) return;
        if (this.aXNWSVA && !TRACK_VIP) {
            console.info(`${atob("R0EgU3VwcHJlc3NlZA==")} pageview; title: "${title}", page: "${page}"`);
            return;
        }
        ga("send", { hitType: "pageview", title: title, page: page });
    }

    private checkIsInstalled(): boolean {
        if (typeof ga === "function") return true;

        console.warn(`Google Analytics ga.js is not installed`);
        return false;
    }
}
