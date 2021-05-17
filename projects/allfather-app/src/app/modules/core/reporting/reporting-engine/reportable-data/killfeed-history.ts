import { MatchInflictionEvent } from "@allfather-app/app/common/match/infliction-event";
import { map } from "rxjs/operators";
import { MatchActivityService } from "../../../match/match-activity.service";
import { ReportableDataTimestampedStream } from "../reportable-data";

type KillfeedHistoryDataOutput = {
    victimName: string;
    attackerName?: string;
    isKnockdown?: boolean;
    isElimination?: boolean;
    weaponId?: string;
};
export function KillfeedHistoryDataFactory(
    killfeedEventObs: MatchActivityService["killfeedEvent$"]
): ReportableDataTimestampedStream<KillfeedHistoryDataOutput> {
    const mapKillfeedEvent = (killfeedEvent: MatchInflictionEvent) => ({
        victimName: killfeedEvent.victim.name,
        attackerName: killfeedEvent.attacker?.name,
        isKnockdown: killfeedEvent.isKnockdown,
        isElimination: killfeedEvent.isElimination,
        weaponId: killfeedEvent.weapon?.itemId,
    });

    return new ReportableDataTimestampedStream({
        dataId: "killfeedHistory",
        source$: killfeedEventObs.pipe(map(mapKillfeedEvent)),
    });
}