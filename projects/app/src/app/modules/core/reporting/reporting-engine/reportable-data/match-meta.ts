import { MatchService } from "@app/modules/core/match/match.service.js";
import { ExtractSubjectType } from "@shared/types/rxjs-utilities.js";
import { ReportableDataSnapshot } from "../reportable-data.js";

type MatchMetaDataOutput = ExtractSubjectType<MatchService["endedEvent$"]>;
export function MatchMetaDataFactory(matchEndedObs: MatchService["endedEvent$"]): ReportableDataSnapshot<MatchMetaDataOutput> {
    return new ReportableDataSnapshot({
        dataId: "matchMeta",
        source$: matchEndedObs,
    });
}
