import { ExtractSubjectType } from "../../../../../../../../../common/types/rxjs-utilities";
import { MatchMapService } from "../../../match/match-map.service";
import { ReportableDataSnapshot } from "../reportable-data";

type MapDataOutput = ExtractSubjectType<MatchMapService["map$"]>;
export function MapDataFactory(mapObs: MatchMapService["map$"]): ReportableDataSnapshot<MapDataOutput> {
    return new ReportableDataSnapshot({
        dataId: "map",
        source$: mapObs,
        persist: true,
    });
}
