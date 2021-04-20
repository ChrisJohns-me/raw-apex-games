import { ExtractSubjectType } from "shared/types/rxjs-utilities";
import { MatchPlayerStatsService } from "../../../match/match-player-stats.service";
import { ReportableDataSnapshot } from "../reportable-data";

type PlacementDataOutput = ExtractSubjectType<MatchPlayerStatsService["myPlacement$"]>;
export function PlacementDataFactory(placementObs: MatchPlayerStatsService["myPlacement$"]): ReportableDataSnapshot<PlacementDataOutput> {
    return new ReportableDataSnapshot({
        dataId: "placement",
        source$: placementObs,
    });
}
