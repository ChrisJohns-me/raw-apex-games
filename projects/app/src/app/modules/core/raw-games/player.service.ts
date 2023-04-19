import { Injectable, OnDestroy } from "@angular/core";
import { SingletonServiceProviderFactory } from "../../../singleton-service.provider.factory";
import { BaseService } from "../base-service.abstract";

/**
 * @classdesc Service for the Raw Apex Games Player.
 */
@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: any[]) => SingletonServiceProviderFactory("RawGamesPlayerService", RawGamesPlayerService, deps),
})
export class RawGamesPlayerService extends BaseService implements OnDestroy {}
