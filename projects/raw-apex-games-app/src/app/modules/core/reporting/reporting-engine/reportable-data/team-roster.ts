import { MatchRosterTeammate } from "@raw-apex-games-app/app/common/match/roster-teammate";
import { map } from "rxjs/operators";
import { MatchRosterService } from "../../../match/match-roster.service";
import { ReportableDataSnapshot } from "../reportable-data";

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
