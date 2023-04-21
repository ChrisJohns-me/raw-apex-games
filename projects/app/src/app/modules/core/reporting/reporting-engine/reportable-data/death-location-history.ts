import { MatchPlayerLocationService } from "#app/modules/core/match/match-player-location.service.js";
import { ExtractSubjectType } from "#shared/types/rxjs-utilities.js";
import { filter, OperatorFunction } from "rxjs";
import { ReportableDataTimestampedStream } from "../reportable-data.js";

type DeathLocationHistoryDataCoordinates = NonNullable<ExtractSubjectType<MatchPlayerLocationService["myDeathCoordinates$"]>>;
export function DeathLocationHistoryDataFactory(
    deathLocationHistoryObs: MatchPlayerLocationService["myDeathCoordinates$"]
): ReportableDataTimestampedStream<DeathLocationHistoryDataCoordinates> {
    const _deathLocationHistoryObs = deathLocationHistoryObs.pipe(
        filter((deathCoordinate) => !!deathCoordinate) as OperatorFunction<
            Optional<DeathLocationHistoryDataCoordinates>,
            DeathLocationHistoryDataCoordinates
        >
    );

    return new ReportableDataTimestampedStream({
        dataId: "deathLocationHistory",
        source$: _deathLocationHistoryObs,
    });
}
