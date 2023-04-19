import { SettingKey, SettingValue } from "../../../common/settings";

/*
 * To prevent object stores from becoming stale,
 *  all database interfaces should be explicit (ie. no imported interfaces).
 * Dates should be stored as their primitive self (provides compression).
 */

/**
 * @class SettingsDataStore
 * @classdesc Class to hold a User's Setting; also provides default setting value.
 */
export class SettingsDataStore<T extends SettingValue = SettingValue> {
    constructor(public key?: SettingKey, public value?: T) {}
}
