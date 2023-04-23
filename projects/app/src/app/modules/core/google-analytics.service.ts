import { environment } from "#app/../environments/environment.js";
import { BaseService } from "#app/modules/core/base-service.abstract.js";
import { OverwolfProfileService } from "#app/modules/core/overwolf/overwolf-profile.service.js";
import { SingletonServiceProviderFactory } from "#app/singleton-service.provider.factory.js";
import { isEmpty } from "#shared/utilities/primitives/boolean.js";
import { Injectable } from "@angular/core";
import { filter, map, take, takeUntil } from "rxjs/operators";

declare let ga: (...args: any[]) => void;

@Injectable({
    providedIn: "root",
    deps: [OverwolfProfileService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("GoogleAnalyticsService", GoogleAnalyticsService, deps),
})
export class GoogleAnalyticsService extends BaseService {
    constructor(private readonly overwolfProfile: OverwolfProfileService) {
        super();
        if (!this.checkIsInstalled()) return;
        ga("create", environment.gaID, "auto");
        // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
        ga("set", "checkProtocolTask", function () {});
        ga("require", "displayfeatures");

        this.overwolfProfile
            .getCurrentUser()
            .pipe(
                takeUntil(this.destroy$),
                filter((userData) => !isEmpty(userData?.username)),
                map((userData) => userData.username),
                take(1)
            )
            .subscribe((un) => {
                ga("set", "userId", un);
            });
    }

    public sendEvent(eventCategory: string, eventAction: string, eventLabel?: string, eventValue?: number): void {
        if (!this.checkIsInstalled()) return;
        ga("send", "event", eventCategory, eventAction, eventLabel, eventValue);
    }

    /**
     * @param title Page title
     * @param page URI of page (must start with /)
     */
    public sendPageview(title: string, page: string): void {
        if (!this.checkIsInstalled()) return;
        ga("send", { hitType: "pageview", title: title, page: page });
    }

    private checkIsInstalled(): boolean {
        if (typeof ga === "function") return true;

        console.warn(`Google Analytics ga.js is not installed`);
        return false;
    }
}
