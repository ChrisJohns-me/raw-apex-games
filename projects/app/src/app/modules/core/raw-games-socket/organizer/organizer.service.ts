import { Injectable, OnDestroy } from "@angular/core";
import { SingletonServiceProviderFactory } from "@app/app/singleton-service.provider.factory";
import { BaseService } from "../../base-service.abstract";

/**
 * @classdesc
 */
@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: any[]) => SingletonServiceProviderFactory("RawGamesSocketOrganizerService", RawGamesSocketOrganizerService, deps),
})
export class RawGamesSocketOrganizerService extends BaseService implements OnDestroy {}
