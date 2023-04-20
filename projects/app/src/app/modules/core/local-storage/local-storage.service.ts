import { Inject, Injectable } from "@angular/core";
import { BaseService } from "@app/modules/core/base-service.abstract.js";
import { WINDOW } from "@app/modules/core/global-window.provider.js";
import { SingletonServiceProviderFactory } from "@app/singleton-service.provider.factory.js";
import { LocalStorageKeys } from "./local-storage-keys";

/**
 * @class LocalStorageService
 * @classdesc Wrapper class used for short term and less important data storage.
 */
@Injectable({
    providedIn: "root",
    deps: [WINDOW],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("LocalStorageService", LocalStorageService, deps),
})
export class LocalStorageService extends BaseService {
    private readonly storage: Storage;

    constructor(@Inject(WINDOW) private readonly window: Window) {
        super();
        this.storage = this.window.localStorage;
    }

    public get(key: string | LocalStorageKeys): string | null {
        return this.storage.getItem(key);
    }

    public set(key: string | LocalStorageKeys, value: string): void {
        this.storage.setItem(key, value);
    }

    public clearItem(key: string | LocalStorageKeys): void {
        this.storage.removeItem(key);
    }

    public clearItems(keys: string[] | LocalStorageKeys[]): void {
        keys.forEach((key) => this.clearItem(key));
    }
}
