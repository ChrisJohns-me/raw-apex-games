/**
 * To prevent object stores from becoming stale,
 *  all database interfaces should be explicit (ie. no imported interfaces).
 * Dates should be stored as their primitive self (provides compression).
 */

type StorageType<T> = T extends number ? "number" : T extends boolean ? "boolean" : T extends string ? "string" : never;

export class SettingsDataStore<T extends boolean | number | string> {
    public key?: string;
    public type?: StorageType<SettingsDataStore<T>["value"]>;
    public value?: T;
}
