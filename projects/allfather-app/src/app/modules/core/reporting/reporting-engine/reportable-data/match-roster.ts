import { MatchRosterPlayer } from "@allfather-app/app/common/match/roster-player";
import { map } from "rxjs/operators";
import { MatchRosterService } from "../../../match/match-roster.service";
import { ReportableDataSnapshot } from "../reportable-data";

type MatchRoster = {
    isMe: boolean;
    name: string;
    teamId: number;
};
type MatchRosterDataOutput = MatchRoster[];
export function MatchRosterDataFactory(matchRosterObs: MatchRosterService["matchRoster$"]): ReportableDataSnapshot<MatchRosterDataOutput> {
    const mapPlayer = (rosterPlayer: MatchRosterPlayer) => ({
        isMe: rosterPlayer.isMe,
        name: rosterPlayer.name,
        teamId: rosterPlayer.teamId ?? -1,
    });

    return new ReportableDataSnapshot({
        dataId: "matchRoster",
        source$: matchRosterObs.pipe(map((matchRoster) => matchRoster.allPlayers.map((player) => mapPlayer(player)))),
    });
}
