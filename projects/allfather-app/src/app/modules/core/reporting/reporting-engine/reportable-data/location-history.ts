import { filter, map } from "rxjs/operators";
import { ExtractSubjectType } from "shared/types/rxjs-utilities";
import { MatchPlayerLocationService } from "../../../match/match-player-location.service";
import { ReportableDataTimestampedStream } from "../reportable-data";

type LocationHistoryDataOutput = NonNullable<ExtractSubjectType<MatchPlayerLocationService["myCoordinates$"]>>;
export function LocationHistoryDataFactory(
    coordinatesObs: MatchPlayerLocationService["myCoordinates$"]
): ReportableDataTimestampedStream<LocationHistoryDataOutput> {
    return new ReportableDataTimestampedStream({
        dataId: "locationHistory",
        source$: coordinatesObs.pipe(
            filter((coordinates) => !!coordinates),
            map((coordinates) => coordinates as LocationHistoryDataOutput)
        ),
    });
}
