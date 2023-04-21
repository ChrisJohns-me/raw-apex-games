import { AllSettings, DefaultSetting, SettingKey, SettingValue } from "#app/models/settings.js";
import { BaseService } from "#app/modules/core/base-service.abstract.js";
import { LocalDatabaseService } from "#app/modules/core/local-database/local-database.service.js";
import { SettingsDataStore } from "#app/modules/core/local-database/settings-data-store.js";
import { SingletonServiceProviderFactory } from "#app/singleton-service.provider.factory.js";
import { Injectable } from "@angular/core";
import { IndexableType } from "dexie";
import { defer, from, merge, Observable, of, throwError } from "rxjs";
import { filter, map, switchMap } from "rxjs/operators";

@Injectable({
    providedIn: "root",
    deps: [LocalDatabaseService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("SettingsService", SettingsService, deps),
})
export class SettingsService extends BaseService {
    constructor(private readonly localDatabase: LocalDatabaseService) {
        super();
    }

    /**
     * Stores setting into local database.
     * Setting enum key should be known.
     * @returns {IndexableType} index key of storage location
     * @throws if any settings are invalid
     */
    public bulkStoreSettings$(settings: SettingsDataStore[]): Observable<IndexableType> {
        let invalidResult: Optional<{ isValid: boolean; invalidReason?: string }>;
        settings.forEach((setting) => {
            const settingValidation = this.validateSetting(setting.key, setting.value);
            if (!settingValidation.isValid) invalidResult = settingValidation;
        });
        if (invalidResult) return throwError(() => invalidResult?.invalidReason);
        return defer(() => from(this.localDatabase.settings.bulkPut(settings)));
    }

    /**
     * Stores setting into local database.
     * Setting enum key must be known.
     * @returns {IndexableType} index key of storage location
     * @throws if setting is invalid
     */
    public storeSetting$(setting: SettingsDataStore): Observable<IndexableType> {
        const settingValidation = this.validateSetting(setting.key, setting.value);
        if (!settingValidation.isValid) return throwError(() => settingValidation.invalidReason);
        return defer(() => from(this.localDatabase.settings.put(setting)));
    }

    /**
     * Provides the settings object by key in the local database.
     * Provides default value if not found; undefined if default is not found.
     */
    public getSetting$<T extends SettingValue>(key: SettingKey): Observable<Optional<SettingsDataStore<T>>> {
        if (!Object.values(SettingKey).includes(key))
            return throwError(
                () => `Cannot retrieve settings value from local database; Setting Key "${key}" is not found in known settings.`
            );
        return defer(() => from(this.localDatabase.settings.get({ key }))).pipe(
            map((savedSetting) => {
                if (savedSetting?.value != null) {
                    return savedSetting as SettingsDataStore<T>;
                } else if (!(key in DefaultSetting)) {
                    console.error(`Settings Key "${key}" is not found in default settings.`);
                    return undefined;
                } else {
                    return {
                        key: key,
                        value: DefaultSetting[key],
                    } as SettingsDataStore<T>;
                }
            })
        );
    }

    /**
     * Streams settings object by key in the local database.
     * Provides default value if not found; undefined if default is not found.
     */
    public streamSetting$<T extends SettingValue>(key: SettingKey): Observable<Optional<SettingsDataStore<T>>> {
        const settingChange$ = this.localDatabase.onChanges$.pipe(
            map((changes) => changes.find((c) => c.table === this.localDatabase.settings.name && c.key === key)),
            map((change) => (change as any)?.obj),
            filter((value) => value != null)
        );

        return merge(this.getSetting$<T>(key), settingChange$);
    }

    /**
     * @returns Key value of all settings stored in the local database.
     */
    public getAllSettings$(): Observable<AllSettings> {
        const settingsCollection = this.localDatabase.settings;
        return defer(() => from(settingsCollection.toArray())).pipe(
            map((settingsArr) => Object.fromEntries(settingsArr.map((s) => [s.key, s.value])))
        );
    }

    /**
     * @returns Stream of key value of all settings stored in the local database.
     */
    public streamAllSettings$(): Observable<AllSettings> {
        const settingsChanged$ = this.localDatabase.onChanges$.pipe(
            filter((changes) => changes.some((c) => c.table === this.localDatabase.settings.name))
        );

        return merge(of(null), settingsChanged$).pipe(
            switchMap(() => this.getAllSettings$()),
            map((currSettings) => ({ ...DefaultSetting, ...currSettings })) // Merge settings
        );
    }

    private validateSetting(key?: SettingKey, value?: SettingValue): { isValid: boolean; invalidReason?: string } {
        if (key == null) return { isValid: false, invalidReason: `Key is empty; contains a value of:\n${JSON.stringify(value)}` };
        if (value == null) return { isValid: false, invalidReason: `"${key}" has an empty value` };

        if (!Object.values(SettingKey).includes(key)) {
            return { isValid: false, invalidReason: `Key "${key}" is not found in known settings.` };
        }
        const valueType = typeof value;
        const defaultValueType = typeof DefaultSetting[key];
        if (valueType !== defaultValueType) {
            return { isValid: false, invalidReason: `key "${key}" type mismatch. ` + `${valueType} != ${defaultValueType}` };
        }

        return { isValid: true };
    }
}
