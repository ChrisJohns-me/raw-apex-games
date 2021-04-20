import { merge, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { OWGameEvent, OWInfoUpdates2Event } from "../../../overwolf";
import { ReportableDataTimestampedStream } from "../reportable-data";

export function GameEventsHistoryDataFactory(
    infoUpdatesObs: Subject<OWInfoUpdates2Event>,
    newGameEventObs: Subject<OWGameEvent>
): ReportableDataTimestampedStream<string> {
    return new ReportableDataTimestampedStream({
        dataId: "gameEventsHistory",
        source$: merge(infoUpdatesObs, newGameEventObs).pipe(map((data) => JSON.stringify(data))),
    });
}
