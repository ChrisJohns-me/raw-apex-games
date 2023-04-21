import { MatchPlayerStatsService } from "#app/modules/core/match/match-player-stats.service.js";
import { ExtractSubjectType } from "#shared/types/rxjs-utilities.js";
import { ReportableDataSnapshot } from "../reportable-data.js";

type KnockdownsDataOutput = ExtractSubjectType<MatchPlayerStatsService["myKnockdowns$"]>;
export function KnockdownsDataFactory(
    myKnockdownsObs: MatchPlayerStatsService["myKnockdowns$"]
): ReportableDataSnapshot<KnockdownsDataOutput> {
    return new ReportableDataSnapshot({
        dataId: "knockdowns",
        source$: myKnockdownsObs,
    });
}
