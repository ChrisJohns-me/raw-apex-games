/**
 * @summary Filter arrays and make them unique, optionally by property if an object array.
 * @param array Array of primitive or objects.
 * @param selector Anonymous function that returns the property to be unique.
 * @example
 *  unique(dataArr)
 * @example
 *  unique(dataArr, (d) => d.group)
 */
export function unique<T>(array: T[] = [], selector?: (item: T) => unknown): T[] {
    return array.filter(
        (value, index) =>
            array.findIndex((a) => {
                if (selector) return selector(a) === selector(value);
                return a === value;
            }) === index
    );
}
