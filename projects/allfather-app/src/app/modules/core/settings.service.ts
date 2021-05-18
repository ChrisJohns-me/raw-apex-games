import { DefaultSettings, SettingKey, SettingValue } from "@allfather-app/app/common/settings";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { IndexableType } from "dexie";
import { defer, from, Observable, throwError } from "rxjs";
import { map } from "rxjs/operators";
import { isEmpty } from "shared/utilities";
import { AllfatherService } from "./allfather-service.abstract";
import { LocalDatabaseService } from "./local-database/local-database.service";
import { SettingsDataStore } from "./local-database/settings-data-store";

@Injectable({
    providedIn: "root",
    deps: [LocalDatabaseService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("SettingsService", SettingsService, deps),
})
export class SettingsService extends AllfatherService {
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
        if (invalidResult) return throwError(invalidResult.invalidReason);
        return defer(() => from(this.localDatabase.table("settings").bulkPut(settings)));
    }

    /**
     * Stores setting into local database.
     * Setting enum key must be known.
     * @returns {IndexableType} index key of storage location
     * @throws if setting is invalid
     */
    public storeSetting$(setting: SettingsDataStore): Observable<IndexableType> {
        const settingValidation = this.validateSetting(setting.key, setting.value);
        if (!settingValidation.isValid) return throwError(settingValidation.invalidReason);
        return defer(() => from(this.localDatabase.table("settings").put(setting)));
    }

    /**
     * Provides the settings value from the key in the local database.
     * Provides default value if not found.
     */
    public getSettingValueOrDefaultByKey$(key: SettingKey): Observable<SettingsDataStore["value"]> {
        return this.getSettingByKey$(key).pipe(
            map((savedSetting) => {
                if (!isEmpty(savedSetting?.value)) return savedSetting?.value;
                else if (!(key in DefaultSettings)) throw `Settings Key "${key}" is not found in default settings.`;
                else return DefaultSettings[key];
            })
        );
    }

    /**
     * Provides the whole settings object from the key in the local database.
     */
    public getSettingByKey$(key: SettingKey): Observable<Optional<SettingsDataStore>> {
        if (!Object.values(SettingKey).includes(key))
            return throwError(`Cannot retrieve settings value from local database; Setting Key "${key}" is not found in known settings.`);
        return defer(() => from(this.localDatabase.settings.get({ key })));
    }

    /**
     * @returns All settings stored in the local database.
     */
    public getAllSettings$(): Observable<SettingsDataStore[]> {
        const settingsCollection = this.localDatabase.settings;
        return defer(() => from(settingsCollection.toArray()));
    }

    /**
     * @returns Array of keys on changes
     */
    public listenSettingsChanges$(): Observable<SettingKey[]> {
        return this.localDatabase.onChanges$.pipe(
            map((changes) => {
                const settingKeysChanged = changes
                    .filter((change) => Object.values(SettingKey).includes(change.key))
                    .map((change) => change.key);
                return settingKeysChanged;
            })
        );
    }

    private validateSetting(key?: SettingKey, value?: SettingValue): { isValid: boolean; invalidReason?: string } {
        if (!key || isEmpty(key)) return { isValid: false, invalidReason: `Key is empty; contains a value of:\n${JSON.stringify(value)}` };
        if (value !== false && isEmpty(value)) return { isValid: false, invalidReason: `"${key}" has an empty value` };

        if (!Object.values(SettingKey).includes(key)) {
            return { isValid: false, invalidReason: `Key "${key}" is not found in known settings.` };
        }
        const valueType = typeof value;
        const defaultValueType = typeof DefaultSettings[key];
        if (valueType !== defaultValueType) {
            return { isValid: false, invalidReason: `key "${key}" type mismatch. ` + `${valueType} != ${defaultValueType}` };
        }

        return { isValid: true };
    }
}
