import { filter, map } from "rxjs";
import { MatchPlayerInflictionService } from "../../../match/match-player-infliction.service";
import { ReportableDataStream } from "../reportable-data";

export function EliminationWeaponIdsDataFactory(
    myKillfeedEventObs: MatchPlayerInflictionService["myKillfeedEvent$"]
): ReportableDataStream<string> {
    const _myKillfeedEventObs = myKillfeedEventObs.pipe(filter((eliminationEvent) => !!eliminationEvent));

    return new ReportableDataStream({
        dataId: "eliminationWeaponIds",
        source$: _myKillfeedEventObs.pipe(
            map((eliminationEvent) => eliminationEvent.weapon?.itemId ?? ""),
            filter((weaponId) => !!weaponId)
        ),
    });
}
