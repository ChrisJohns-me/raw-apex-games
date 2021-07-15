import { SettingKey, SettingValue } from "@allfather-app/app/common/settings";
import { OverwolfFeatureDep } from "@shared-app/feature-status";
import { Observable, of } from "rxjs";
import { SettingsDataStore } from "../local-database/settings-data-store";
import { SettingsService } from "../settings.service";

export class MockSettingsService implements MockedClass<SettingsService> {
    public bulkStoreSettings$(settings: SettingsDataStore[]): ReturnType<SettingsService["bulkStoreSettings$"]> {
        return of();
    }

    public storeSetting$(setting: SettingsDataStore): ReturnType<SettingsService["storeSetting$"]> {
        return of();
    }

    public getSetting$<T extends SettingValue>(key: SettingKey): Observable<Optional<SettingsDataStore<T>>> {
        return of();
    }

    public streamSetting$<T extends SettingValue>(key: SettingKey): Observable<Optional<SettingsDataStore<T>>> {
        return of();
    }

    public getAllSettings$(): ReturnType<SettingsService["getAllSettings$"]> {
        return of();
    }

    public streamAllSettings$(): ReturnType<SettingsService["streamAllSettings$"]> {
        return of();
    }

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
