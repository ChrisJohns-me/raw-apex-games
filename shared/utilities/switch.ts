/**
 * @summary Helpful for typings.
 *  Used at the end of a switch statement when switching through Enums.
 * @example
 *   switch (input) {
 *      case Enum.Case1:
 *          return;
 *      default:
 *          exhaustiveEnumSwitch(input);
 *   }
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function exhaustiveEnumSwitch(_x: never): never {
    throw Error(`Unreachable switch case, for "${_x}"`);
}
