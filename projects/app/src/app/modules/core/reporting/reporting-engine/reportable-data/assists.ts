import { ExtractSubjectType } from "../../../../../../../../../common/types/rxjs-utilities";
import { MatchPlayerStatsService } from "../../../match/match-player-stats.service";
import { ReportableDataSnapshot } from "../reportable-data";

type AssistsDataOutput = ExtractSubjectType<MatchPlayerStatsService["myAssists$"]>;
export function AssistsDataFactory(assistsObs: MatchPlayerStatsService["myAssists$"]): ReportableDataSnapshot<AssistsDataOutput> {
    return new ReportableDataSnapshot({
        dataId: "assists",
        source$: assistsObs,
    });
}
