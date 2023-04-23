import { BaseService } from "#app/modules/core/base-service.abstract.js";
import { SingletonServiceProviderFactory } from "#app/singleton-service.provider.factory.js";
import { Injectable } from "@angular/core";
import { UtilsDelegate } from "./api/utils-delegate.js";
/**
 * @class OverwolfUtilsService
 * @classdesc Wrapper for Overwolf's "overwolf.utils" API namespace.
 */
@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("OverwolfUtilsService", OverwolfUtilsService, deps),
})
export class OverwolfUtilsService extends BaseService {
    private utilsDelegate = new UtilsDelegate();

    constructor() {
        super();
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    /**
     * Copies the given string to the clipboard.
     */
    public copyToClipboard(data: string): void {
        return this.utilsDelegate.placeOnClipboard(data);
    }
}
