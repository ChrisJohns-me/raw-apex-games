import { Injectable } from "@angular/core";
import { SingletonServiceProviderFactory } from "@shared-app/singleton-service.provider.factory";
import { ReplaySubject } from "rxjs";
import { Notification } from "../notification";

/**
 * @classdesc Used to pass notifications to the component
 */
@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("HUDNotificationService", HUDNotificationService, deps),
})
export class HUDNotificationService {
    public readonly notification$ = new ReplaySubject<Notification>(1);
}
