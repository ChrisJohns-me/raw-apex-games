import { Inject, Injectable } from "@angular/core";
import { SingletonServiceProviderFactory } from "../../../singleton-service.provider.factory";
import { BaseService } from "../base-service.abstract";
import { WINDOW } from "../global-window.provider";
import { SessionStorageKeys } from "./session-storage-keys";

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
