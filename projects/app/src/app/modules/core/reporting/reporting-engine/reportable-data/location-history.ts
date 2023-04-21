import { MatchPlayerLocationService } from "#app/modules/core/match/match-player-location.service.js";
import { ExtractSubjectType } from "#shared/types/rxjs-utilities.js";
import { OperatorFunction } from "rxjs";
import { filter, map, throttleTime, withLatestFrom } from "rxjs/operators";
import { ReportableDataTimestampedStream } from "../reportable-data.js";

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
        filter((locationPhase) => !!locationPhase) as OperatorFunction<Optional<LocationHistoryDataPhase>, LocationHistoryDataPhase>
    );

    return new ReportableDataTimestampedStream({
        dataId: "locationHistory",
        source$: coordinatesObs.pipe(
            throttleTime(LOCATION_DATA_THROTTLE),
            filter((coordinates) => !!coordinates) as OperatorFunction<
                Optional<LocationHistoryDataCoordinates>,
                LocationHistoryDataCoordinates
            >,
            withLatestFrom(_locationPhaseObs),
            map(([coordinates, locationPhase]) => {
                return { ...coordinates, phase: locationPhase };
            })
        ),
    });
}
