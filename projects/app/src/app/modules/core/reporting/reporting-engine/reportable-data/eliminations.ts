import { MatchPlayerStatsService } from "#app/modules/core/match/match-player-stats.service.js";
import { ExtractSubjectType } from "#shared/types/rxjs-utilities.js";
import { ReportableDataSnapshot } from "../reportable-data.js";

type EliminationsDataOutput = ExtractSubjectType<MatchPlayerStatsService["myEliminations$"]>;
export function EliminationsDataFactory(
    myEliminationsObs: MatchPlayerStatsService["myEliminations$"]
): ReportableDataSnapshot<EliminationsDataOutput> {
    return new ReportableDataSnapshot({
        dataId: "eliminations",
        source$: myEliminationsObs,
    });
}
