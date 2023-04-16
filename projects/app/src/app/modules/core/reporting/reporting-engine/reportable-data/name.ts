import { ExtractSubjectType } from "common/types/rxjs-utilities";
import { PlayerService } from "../../../player.service";
import { ReportableDataSnapshot } from "../reportable-data";

type NameDataOutput = ExtractSubjectType<PlayerService["myName$"]>;
export function NameDataFactory(myNameObs: PlayerService["myName$"]): ReportableDataSnapshot<NameDataOutput> {
    return new ReportableDataSnapshot({
        dataId: "name",
        source$: myNameObs,
        persist: true,
    });
}
