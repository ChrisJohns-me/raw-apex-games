import { Injectable } from "@angular/core";
import { SingletonServiceProviderFactory } from "@shared-app/singleton-service.provider.factory";
import { Observable } from "rxjs";
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
