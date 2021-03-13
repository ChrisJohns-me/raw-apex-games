type Optional<T> = T | undefined;
type Nullable<T> = T | undefined | null;
type AnyObject = { [key: string]: any };

/**
 * Unionizes all of an object's property types
 * @example
 *      ObjectPropertyTypes<{key1: string, key2: number, key3: boolean}> = string | number | boolean
 */
type ObjectPropertyTypes<T> = {
    [K in keyof T]-?: T[K];
}[keyof T];
