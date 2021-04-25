import { filter, map, withLatestFrom } from "rxjs/operators";
import { ExtractSubjectType } from "shared/types/rxjs-utilities";
import { MatchPlayerLocationService } from "../../../match/match-player-location.service";
import { ReportableDataTimestampedStream } from "../reportable-data";

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
            filter((coordinates) => !!coordinates),
            map((coordinates) => coordinates as LocationHistoryDataCoordinates),
            withLatestFrom(_locationPhaseObs),
            map(([coordinates, locationPhase]) => {
                return { ...coordinates, phase: locationPhase };
            })
        ),
    });
}
