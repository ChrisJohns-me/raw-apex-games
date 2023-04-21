import { PlayerService } from "#app/modules/core/player.service.js";
import { ExtractSubjectType } from "#shared/types/rxjs-utilities.js";
import { ReportableDataSnapshot } from "../reportable-data.js";

type NameDataOutput = ExtractSubjectType<PlayerService["myName$"]>;
export function NameDataFactory(myNameObs: PlayerService["myName$"]): ReportableDataSnapshot<NameDataOutput> {
    return new ReportableDataSnapshot({
        dataId: "name",
        source$: myNameObs,
        persist: true,
    });
}
