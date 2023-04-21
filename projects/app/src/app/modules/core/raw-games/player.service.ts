import { BaseService } from "#app/modules/core/base-service.abstract.js";
import { SingletonServiceProviderFactory } from "#app/singleton-service.provider.factory.js";
import { Injectable, OnDestroy } from "@angular/core";

/**
 * @classdesc Service for the Raw Apex Games Player.
 */
@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: any[]) => SingletonServiceProviderFactory("RawGamesPlayerService", RawGamesPlayerService, deps),
})
export class RawGamesPlayerService extends BaseService implements OnDestroy {}
