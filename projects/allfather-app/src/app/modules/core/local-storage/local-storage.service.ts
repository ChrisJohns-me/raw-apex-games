import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Inject, Injectable } from "@angular/core";
import { AllfatherService } from "../allfather-service.abstract";
import { WINDOW } from "../window.service";
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
export class LocalStorageService extends AllfatherService {
    private readonly storage: Storage;

    constructor(@Inject(WINDOW) private readonly window: Window) {
        super();
        this.storage = this.window.localStorage;
    }

    public init(): void {}

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
