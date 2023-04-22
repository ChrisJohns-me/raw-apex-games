import { PlayerOriginIdService } from "#app/modules/core/player-origin-id.service.js";
import { ExtractSubjectType } from "#shared/types/rxjs-utilities.js";
import { ReportableDataSnapshot } from "../reportable-data.js";

type MyOriginIdDataOutput = ExtractSubjectType<PlayerOriginIdService["myOriginId$"]>;
export function MyOriginIdDataFactory(myOriginIdObs: PlayerOriginIdService["myOriginId$"]): ReportableDataSnapshot<MyOriginIdDataOutput> {
    return new ReportableDataSnapshot({
        dataId: "myOriginId",
        source$: myOriginIdObs,
        persist: true,
    });
}
