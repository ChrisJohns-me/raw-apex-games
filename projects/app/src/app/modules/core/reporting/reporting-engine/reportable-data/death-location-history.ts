import { filter, OperatorFunction } from "rxjs";
import { ExtractSubjectType } from "../../../../../../../../../common/types/rxjs-utilities";
import { MatchPlayerLocationService } from "../../../match/match-player-location.service";
import { ReportableDataTimestampedStream } from "../reportable-data";

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
