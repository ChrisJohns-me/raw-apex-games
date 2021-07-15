import { ExtractSubjectType } from "common/types/rxjs-utilities";
import { MatchPlayerLegendService } from "../../../match/match-player-legend.service";
import { ReportableDataStream } from "../reportable-data";

type UltimateUsageDatesDataOutput = ExtractSubjectType<MatchPlayerLegendService["myUltimateUsage$"]>;
export function UltimateUsageDatesDataFactory(
    ultimateUsageObs: MatchPlayerLegendService["myUltimateUsage$"]
): ReportableDataStream<UltimateUsageDatesDataOutput> {
    return new ReportableDataStream({
        dataId: "ultimateUsageDates",
        source$: ultimateUsageObs,
    });
}
