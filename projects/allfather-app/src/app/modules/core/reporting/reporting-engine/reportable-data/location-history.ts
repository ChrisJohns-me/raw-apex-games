import { ExtractSubjectType } from "common/types/rxjs-utilities";
import { filter, map, throttleTime, withLatestFrom } from "rxjs/operators";
import { MatchPlayerLocationService } from "../../../match/match-player-location.service";
import { ReportableDataTimestampedStream } from "../reportable-data";

/** Time in ms to throttle recorded location data. Changing this affects past heatmap graphs. */
const LOCATION_DATA_THROTTLE = 5000;

type LocationHistoryDataCoordinates = NonNullable<ExtractSubjectType<MatchPlayerLocationService["myCoordinates$"]>>;
type LocationHistoryDataPhase = NonNullable<ExtractSubjectType<MatchPlayerLocationService["myLocationPhase$"]>>;
type LocationHistoryDataOutput = LocationHistoryDataCoordinates & { phase: LocationHistoryDataPhase };
export function LocationHistoryDataFactory(
    coordinatesObs: MatchPlayerLocationService["myCoordinates$"],
    locationPhaseObs: MatchPlayerLocationService["myLocationPhase$"]
): ReportableDataTimestampedStream<LocationHistoryDataOutput> {
    const _locationPhaseObs = locationPhaseObs.pipe(
        filter((locationPhase) => !!locationPhase),
        map((locationPhase) => locationPhase as LocationHistoryDataPhase)
    );

    return new ReportableDataTimestampedStream({
        dataId: "locationHistory",
        source$: coordinatesObs.pipe(
            throttleTime(LOCATION_DATA_THROTTLE),
            filter((coordinates) => !!coordinates),
            map((coordinates) => coordinates as LocationHistoryDataCoordinates),
            withLatestFrom(_locationPhaseObs),
            map(([coordinates, locationPhase]) => {
                return { ...coordinates, phase: locationPhase };
            })
        ),
    });
}
