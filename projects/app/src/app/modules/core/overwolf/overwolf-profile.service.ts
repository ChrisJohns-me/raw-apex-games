import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SingletonServiceProviderFactory } from "../../../singleton-service.provider.factory";
import { BaseService } from "../base-service.abstract";
import { ProfileDelegate } from "./api/profile/profile-delegate";

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
