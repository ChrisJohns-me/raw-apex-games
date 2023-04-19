import { ExtractSubjectType } from "../../../../../../../../../common/types/rxjs-utilities";
import { MatchPlayerStatsService } from "../../../match/match-player-stats.service";
import { ReportableDataSnapshot } from "../reportable-data";

type EliminationsDataOutput = ExtractSubjectType<MatchPlayerStatsService["myEliminations$"]>;
export function EliminationsDataFactory(
    myEliminationsObs: MatchPlayerStatsService["myEliminations$"]
): ReportableDataSnapshot<EliminationsDataOutput> {
    return new ReportableDataSnapshot({
        dataId: "eliminations",
        source$: myEliminationsObs,
    });
}
