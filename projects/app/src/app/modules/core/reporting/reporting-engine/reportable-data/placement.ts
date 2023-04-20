import { MatchPlayerStatsService } from "@app/modules/core/match/match-player-stats.service.js";
import { ExtractSubjectType } from "@shared/types/rxjs-utilities.js";
import { ReportableDataSnapshot } from "../reportable-data.js";

type PlacementDataOutput = ExtractSubjectType<MatchPlayerStatsService["myPlacement$"]>;
export function PlacementDataFactory(placementObs: MatchPlayerStatsService["myPlacement$"]): ReportableDataSnapshot<PlacementDataOutput> {
    return new ReportableDataSnapshot({
        dataId: "placement",
        source$: placementObs,
    });
}
