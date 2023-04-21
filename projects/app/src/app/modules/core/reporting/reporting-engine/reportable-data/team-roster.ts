import { MatchRosterTeammate } from "#app/models/match/roster-teammate.js";
import { MatchRosterService } from "#app/modules/core/match/match-roster.service.js";
import { map } from "rxjs/operators";
import { ReportableDataSnapshot } from "../reportable-data.js";

type TeamRoster = {
    isMe: boolean;
    legendId: string;
    name: string;
};
type TeamRosterDataOutput = TeamRoster[];
export function TeamRosterDataFactory(teamRosterObs: MatchRosterService["teammateRoster$"]): ReportableDataSnapshot<TeamRosterDataOutput> {
    const mapTeammates = (teammate: MatchRosterTeammate): TeamRoster => ({
        isMe: teammate.isMe,
        legendId: teammate.legend?.legendId ?? "",
        name: teammate.name,
    });

    return new ReportableDataSnapshot({
        dataId: "teamRoster",
        source$: teamRosterObs.pipe(map((teamRoster) => teamRoster.allPlayers.map(mapTeammates))),
    });
}
