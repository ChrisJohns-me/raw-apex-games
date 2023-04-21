import { MatchPlayerStatsService } from "#app/modules/core/match/match-player-stats.service.js";
import { ExtractSubjectType } from "#shared/types/rxjs-utilities.js";
import { ReportableDataSnapshot } from "../reportable-data.js";

type AssistsDataOutput = ExtractSubjectType<MatchPlayerStatsService["myAssists$"]>;
export function AssistsDataFactory(assistsObs: MatchPlayerStatsService["myAssists$"]): ReportableDataSnapshot<AssistsDataOutput> {
    return new ReportableDataSnapshot({
        dataId: "assists",
        source$: assistsObs,
    });
}
