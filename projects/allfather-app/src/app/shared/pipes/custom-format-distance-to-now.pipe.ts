import { Pipe, PipeTransform } from "@angular/core";
import { formatDistanceToNowStrict } from "date-fns";

/**
 * @param value The date expression: a `Date` object, a number
 * (milliseconds since UTC epoch), or an ISO string (https://www.w3.org/TR/NOTE-datetime).
 * @param roundingMethod which way to round partial units
 * @param unitNaming Custom text to use for each unit.
 * @returns Return the distance between the given dates in words, using strict units. This is
 *  like formatDistance, but does not use helpers like 'almost', 'over', 'less than' and the like.
 */
@Pipe({ name: "customFormatDistanceToNow" })
export class CustomFormatDistanceToNowPipe implements PipeTransform {
    transform(
        value: Date,
        unitNaming?: {
            year?: string;
            month?: string;
            day?: string;
            hour?: string;
            minute?: string;
            second?: string;
        },
        roundingMethod?: "floor" | "ceil" | "round" | undefined
    ): string {
        const customFormattedText = formatDistanceToNowStrict(value, { roundingMethod })
            .replace("year", unitNaming?.year ?? "year")
            .replace("years", unitNaming?.year ?? "year")
            .replace("month", unitNaming?.month ?? "month")
            .replace("months", unitNaming?.month ?? "month")
            .replace("day", unitNaming?.day ?? "day")
            .replace("days", unitNaming?.day ?? "day")
            .replace("hour", unitNaming?.hour ?? "hour")
            .replace("hours", unitNaming?.hour ?? "hour")
            .replace("minute", unitNaming?.minute ?? "minute")
            .replace("minutes", unitNaming?.minute ?? "minute")
            .replace("second", unitNaming?.second ?? "second")
            .replace("seconds", unitNaming?.second ?? "second");

        return customFormattedText;
    }
}
