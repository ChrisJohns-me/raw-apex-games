import { MatchPlayerLocationService } from "#app/modules/core/match/match-player-location.service.js";
import { ExtractSubjectType } from "#shared/types/rxjs-utilities.js";
import { filter, OperatorFunction } from "rxjs";
import { ReportableDataTimestampedStream } from "../reportable-data.js";

type EliminationLocationHistoryDataCoordinates = NonNullable<ExtractSubjectType<MatchPlayerLocationService["myEliminationCoordinates$"]>>;
export function EliminationLocationHistoryDataFactory(
    eliminationLocationHistoryObs: MatchPlayerLocationService["myEliminationCoordinates$"]
): ReportableDataTimestampedStream<EliminationLocationHistoryDataCoordinates> {
    const _eliminationLocationHistoryObs = eliminationLocationHistoryObs.pipe(
        filter((eliminationCoordinate) => !!eliminationCoordinate) as OperatorFunction<
            Optional<EliminationLocationHistoryDataCoordinates>,
            EliminationLocationHistoryDataCoordinates
        >
    );

    return new ReportableDataTimestampedStream({
        dataId: "eliminationLocationHistory",
        source$: _eliminationLocationHistoryObs,
    });
}
