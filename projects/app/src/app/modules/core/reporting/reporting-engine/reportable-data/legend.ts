import { MatchPlayerLegendService } from "#app/modules/core/match/match-player-legend.service.js";
import { ExtractSubjectType } from "#shared/types/rxjs-utilities.js";
import { ReportableDataSnapshot } from "../reportable-data.js";

type LegendDataOutput = ExtractSubjectType<MatchPlayerLegendService["myLegend$"]>;
export function LegendDataFactory(myLegendObs: MatchPlayerLegendService["myLegend$"]): ReportableDataSnapshot<LegendDataOutput> {
    return new ReportableDataSnapshot({
        dataId: "legendId",
        source$: myLegendObs,
        persist: true,
    });
}
