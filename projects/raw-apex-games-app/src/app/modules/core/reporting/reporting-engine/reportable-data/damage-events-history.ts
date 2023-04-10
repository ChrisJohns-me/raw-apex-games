import { map } from "rxjs/operators";
import { MatchPlayerInflictionService } from "../../../match/match-player-infliction.service";
import { ReportableDataTimestampedStream } from "../reportable-data";

type DamageEventsHistoryDataOutput = {
    hasShield?: boolean;
    healthDamage?: number;
    shieldDamage?: number;
    victimName: string;
    weaponId?: string;
};
export function DamageEventsHistoryDataFactory(
    damageEventsObs: MatchPlayerInflictionService["myDamageEvent$"]
): ReportableDataTimestampedStream<DamageEventsHistoryDataOutput> {
    return new ReportableDataTimestampedStream({
        dataId: "damageEventsHistory",
        source$: damageEventsObs.pipe(
            map((damageEvent) => {
                return {
                    hasShield: damageEvent.hasShield,
                    healthDamage: damageEvent.healthDamage,
                    shieldDamage: damageEvent.shieldDamage,
                    victimName: damageEvent.victim.name,
                    weaponId: damageEvent.weapon?.itemId,
                };
            })
        ),
    });
}
