import { PlayerNameService } from "#app/modules/core/player-name.service.js";
import { ExtractSubjectType } from "#shared/types/rxjs-utilities.js";
import { ReportableDataSnapshot } from "../reportable-data.js";

type MyNameDataOutput = ExtractSubjectType<PlayerNameService["myName$"]>;
export function MyNameDataFactory(myNameObs: PlayerNameService["myName$"]): ReportableDataSnapshot<MyNameDataOutput> {
    return new ReportableDataSnapshot({
        dataId: "myName",
        source$: myNameObs,
        persist: true,
    });
}
