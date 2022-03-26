import { ExtractSubjectType } from "common/types/rxjs-utilities";
import { MatchPlayerStatsService } from "../../../match/match-player-stats.service";
import { ReportableDataSnapshot } from "../reportable-data";

type DeathsDataOutput = ExtractSubjectType<MatchPlayerStatsService["myDeaths$"]>;
export function DeathsDataFactory(myDeathsObs: MatchPlayerStatsService["myDeaths$"]): ReportableDataSnapshot<DeathsDataOutput> {
    return new ReportableDataSnapshot({
        dataId: "deaths",
        source$: myDeathsObs,
    });
}
