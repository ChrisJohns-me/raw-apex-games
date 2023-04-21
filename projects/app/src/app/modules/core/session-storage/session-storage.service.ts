import { BaseService } from "#app/modules/core/base-service.abstract.js";
import { WINDOW } from "#app/modules/core/global-window.provider.js";
import { SessionStorageKeys } from "#app/modules/core/session-storage/session-storage-keys.js";
import { SingletonServiceProviderFactory } from "#app/singleton-service.provider.factory.js";
import { Inject, Injectable } from "@angular/core";

/**
 * @class SessionStorageService
 * @classdesc Wrapper class used for extremely short term and volatile data storage.
 */
@Injectable({
    providedIn: "root",
    deps: [WINDOW],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("SessionStorageService", SessionStorageService, deps),
})
export class SessionStorageService extends BaseService {
    private readonly storage: Storage;

    constructor(@Inject(WINDOW) private readonly window: Window) {
        super();
        this.storage = this.window.sessionStorage;
    }

    public get(key: string | SessionStorageKeys): string | null {
        return this.storage.getItem(key);
    }

    public set(key: string | SessionStorageKeys, value: string): void {
        this.storage.setItem(key, value);
    }

    public clearItem(key: string | SessionStorageKeys): void {
        this.storage.removeItem(key);
    }

    public clearItems(keys: string[] | SessionStorageKeys[]): void {
        keys.forEach((key) => this.clearItem(key));
    }
}
