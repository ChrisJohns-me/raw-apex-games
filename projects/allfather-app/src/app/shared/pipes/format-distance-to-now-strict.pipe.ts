import { Pipe, PipeTransform } from "@angular/core";
import { formatDistanceToNowStrict } from "date-fns";

/**
 * @param value The date expression: a `Date` object,  a number
 * (milliseconds since UTC epoch), or an ISO string (https://www.w3.org/TR/NOTE-datetime).
 * @param addSuffix result indicates if the second date is earlier or later than the first
 * @param unit if specified, will force a unit
 * @param roundingMethod which way to round partial units
 * @returns Return the distance between the given dates in words, using strict units. This is
 *  like formatDistance, but does not use helpers like 'almost', 'over', 'less than' and the like.
 * @see https://date-fns.org/docs/formatDistanceToNowStrict
 */
@Pipe({ name: "formatDistanceToNowStrict", pure: false })
export class FormatDistanceToNowStrictPipe implements PipeTransform {
    transform(
        value: Date,
        addSuffix: boolean | undefined = undefined,
        unit: "second" | "minute" | "hour" | "day" | "month" | "year" | undefined = undefined,
        roundingMethod: "floor" | "ceil" | "round" | undefined = undefined
    ): string {
        return formatDistanceToNowStrict(new Date(value), { addSuffix, unit, roundingMethod });
    }
}
