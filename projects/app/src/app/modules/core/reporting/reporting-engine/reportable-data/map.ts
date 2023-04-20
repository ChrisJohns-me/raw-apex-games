import { MatchMapService } from "@app/modules/core/match/match-map.service.js";
import { ExtractSubjectType } from "@shared/types/rxjs-utilities.js";
import { ReportableDataSnapshot } from "../reportable-data.js";

type MapDataOutput = ExtractSubjectType<MatchMapService["map$"]>;
export function MapDataFactory(mapObs: MatchMapService["map$"]): ReportableDataSnapshot<MapDataOutput> {
    return new ReportableDataSnapshot({
        dataId: "map",
        source$: mapObs,
        persist: true,
    });
}
