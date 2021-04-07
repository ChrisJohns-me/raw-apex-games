type Optional<T> = T | undefined;
type Nullable<T> = T | undefined | null;
type AnyObject = { [key: string]: any };
type MockedClass<T> = Omit<
    Pick<T, keyof T>,
    "ngOnChanges" | "ngOnInit" | "ngDoCheck" | "ngAfterContentInit" | "ngAfterContentChecked" | "ngAfterViewChecked" | "ngOnDestroy"
>;

/**
 * Make all properties (including subtypes) in T optional
 */
type DeepPartial<T> = Partial<{ [P in keyof T]: DeepPartial<T[P]> }>;

/**
 * Unionizes all of an object's property types
 * @example
 *      ObjectPropertyTypes<{key1: string, key2: number, key3: boolean}> = string | number | boolean
 */
type ObjectPropertyTypes<T> = {
    [K in keyof T]-?: T[K];
}[keyof T];
