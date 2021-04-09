import { Pipe, PipeTransform } from "@angular/core";
import { formatDistanceToNow } from "date-fns";

/**
 * @param value The date expression: a `Date` object,  a number
 * (milliseconds since UTC epoch), or an ISO string (https://www.w3.org/TR/NOTE-datetime).
 * @param addSuffix result specifies if now is earlier or later than the passed date
 * @param includeSeconds distances less than a minute are more detailed
 * @returns Return the distance between the given date and now in words.
 * @see https://date-fns.org/docs/formatDistanceToNow
 */
@Pipe({ name: "formatDistanceToNow", pure: false })
export class FormatDistanceToNowPipe implements PipeTransform {
    transform(value: Date, addSuffix: boolean | undefined = undefined, includeSeconds: boolean | undefined = undefined): string {
        return formatDistanceToNow(new Date(value), { includeSeconds, addSuffix });
    }
}
