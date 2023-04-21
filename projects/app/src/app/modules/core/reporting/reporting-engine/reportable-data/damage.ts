import { MatchPlayerStatsService } from "#app/modules/core/match/match-player-stats.service.js";
import { ExtractSubjectType } from "#shared/types/rxjs-utilities.js";
import { ReportableDataSnapshot } from "../reportable-data.js";

type DamageDataOutput = ExtractSubjectType<MatchPlayerStatsService["myDamage$"]>;
export function DamageDataFactory(damageObs: MatchPlayerStatsService["myDamage$"]): ReportableDataSnapshot<DamageDataOutput> {
    return new ReportableDataSnapshot({
        dataId: "damage",
        source$: damageObs,
    });
}
