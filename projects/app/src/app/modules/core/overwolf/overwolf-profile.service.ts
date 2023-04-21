import { BaseService } from "#app/modules/core/base-service.abstract.js";
import { SingletonServiceProviderFactory } from "#app/singleton-service.provider.factory.js";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ProfileDelegate } from "./api/profile/profile-delegate.js";

/**
 * @class OverwolfProfileService
 * @classdesc Wrapper for Overwolf's "overwolf.profile." API namespace.
 */
@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("OverwolfProfileService", OverwolfProfileService, deps),
})
export class OverwolfProfileService extends BaseService {
    private profileDelegate = new ProfileDelegate();

    public getCurrentUser(): Observable<overwolf.profile.GetCurrentUserResult> {
        return this.profileDelegate.getCurrentUser();
    }
}
