import { ExtractSubjectType } from "../../../../../../../../../common/types/rxjs-utilities";
import { MatchPlayerStatsService } from "../../../match/match-player-stats.service";
import { ReportableDataSnapshot } from "../reportable-data";

type DamageDataOutput = ExtractSubjectType<MatchPlayerStatsService["myDamage$"]>;
export function DamageDataFactory(damageObs: MatchPlayerStatsService["myDamage$"]): ReportableDataSnapshot<DamageDataOutput> {
    return new ReportableDataSnapshot({
        dataId: "damage",
        source$: damageObs,
    });
}
