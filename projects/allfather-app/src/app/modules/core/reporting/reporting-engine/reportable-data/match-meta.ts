import { ExtractSubjectType } from "shared/types/rxjs-utilities";
import { MatchService } from "../../../match/match.service";
import { ReportableDataSnapshot } from "../reportable-data";

type MatchMetaDataOutput = ExtractSubjectType<MatchService["endedEvent$"]>;
export function MatchMetaDataFactory(matchEndedObs: MatchService["endedEvent$"]): ReportableDataSnapshot<MatchMetaDataOutput> {
    return new ReportableDataSnapshot({
        dataId: "matchMeta",
        source$: matchEndedObs,
    });
}
