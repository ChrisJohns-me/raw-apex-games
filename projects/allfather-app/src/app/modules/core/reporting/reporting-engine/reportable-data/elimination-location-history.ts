import { ExtractSubjectType } from "common/types/rxjs-utilities";
import { filter, map } from "rxjs";
import { MatchPlayerLocationService } from "../../../match/match-player-location.service";
import { ReportableDataTimestampedStream } from "../reportable-data";

type EliminationLocationHistoryDataCoordinates = NonNullable<ExtractSubjectType<MatchPlayerLocationService["myEliminationCoordinates$"]>>;
export function EliminationLocationHistoryDataFactory(
    eliminationLocationHistoryObs: MatchPlayerLocationService["myEliminationCoordinates$"]
): ReportableDataTimestampedStream<EliminationLocationHistoryDataCoordinates> {
    const _eliminationLocationHistoryObs = eliminationLocationHistoryObs.pipe(
        filter((eliminationCoordinate) => !!eliminationCoordinate),
        map((eliminationCoordinate) => eliminationCoordinate as EliminationLocationHistoryDataCoordinates)
    );

    return new ReportableDataTimestampedStream({
        dataId: "eliminationLocationHistory",
        source$: _eliminationLocationHistoryObs,
    });
}
