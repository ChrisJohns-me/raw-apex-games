import { combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { MatchPlayerStatsService } from "../../../match/match-player-stats.service";
import { MatchRosterService } from "../../../match/match-roster.service";
import { ReportableDataSnapshot } from "../reportable-data";

type MatchSummaryDataOutput = {
    assists: number;
    damage: number;
    eliminations: number;
    deaths: number;
    knockdowns: number;
    maxPlacement: number;
    placement: number;
};
export function MatchSummaryDataFactory({
    myAssistsObs,
    myDamageObs,
    myEliminationsObs,
    myDeathsObs,
    myKnockdownsObs,
    myPlacementObs,
    startingNumTeamsObs,
}: {
    myAssistsObs: MatchPlayerStatsService["myAssists$"];
    myDamageObs: MatchPlayerStatsService["myDamage$"];
    myEliminationsObs: MatchPlayerStatsService["myEliminations$"];
    myDeathsObs: MatchPlayerStatsService["myDeaths$"];
    myKnockdownsObs: MatchPlayerStatsService["myKnockdowns$"];
    myPlacementObs: MatchPlayerStatsService["myPlacement$"];
    startingNumTeamsObs: MatchRosterService["startingNumTeams$"];
}): ReportableDataSnapshot<MatchSummaryDataOutput> {
    return new ReportableDataSnapshot({
        dataId: "matchSummary",
        source$: combineLatest([
            myAssistsObs,
            myDamageObs,
            myEliminationsObs,
            myDeathsObs,
            myKnockdownsObs,
            myPlacementObs,
            startingNumTeamsObs,
        ]).pipe(
            map(([myAssists, myDamage, myEliminations, myDeaths, myKnockdowns, myPlacement, startingNumTeams]) => {
                return {
                    assists: myAssists,
                    damage: myDamage,
                    eliminations: myEliminations,
                    deaths: myDeaths,
                    knockdowns: myKnockdowns,
                    maxPlacement: startingNumTeams,
                    placement: myPlacement,
                };
            })
        ),
    });
}
