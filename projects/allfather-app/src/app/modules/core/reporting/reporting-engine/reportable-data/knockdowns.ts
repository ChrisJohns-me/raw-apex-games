import { ExtractSubjectType } from "shared/types/rxjs-utilities";
import { MatchPlayerStatsService } from "../../../match/match-player-stats.service";
import { ReportableDataSnapshot } from "../reportable-data";

type KnockdownsDataOutput = ExtractSubjectType<MatchPlayerStatsService["myKnockdowns$"]>;
export function KnockdownsDataFactory(
    myKnockdownsObs: MatchPlayerStatsService["myKnockdowns$"]
): ReportableDataSnapshot<KnockdownsDataOutput> {
    return new ReportableDataSnapshot({
        dataId: "knockdowns",
        source$: myKnockdownsObs,
    });
}
