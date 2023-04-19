import { ExtractSubjectType } from "../../../../../../../../../common/types/rxjs-utilities";
import { MatchPlayerLegendService } from "../../../match/match-player-legend.service";
import { ReportableDataSnapshot } from "../reportable-data";

type LegendDataOutput = ExtractSubjectType<MatchPlayerLegendService["myLegend$"]>;
export function LegendDataFactory(myLegendObs: MatchPlayerLegendService["myLegend$"]): ReportableDataSnapshot<LegendDataOutput> {
    return new ReportableDataSnapshot({
        dataId: "legendId",
        source$: myLegendObs,
        persist: true,
    });
}
