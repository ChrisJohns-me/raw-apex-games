import { MatchRosterPlayer } from "@shared-app/match/roster-player";
import { PlatformHardware, PlatformSoftware } from "@shared-app/platform";
import { map } from "rxjs/operators";
import { MatchRosterService } from "../../../match/match-roster.service";
import { ReportableDataSnapshot } from "../reportable-data";

type MatchRoster = {
    isMe: boolean;
    name: string;
    teamId: number;
    hw?: PlatformHardware;
    sw?: PlatformSoftware;
};
type MatchRosterDataOutput = MatchRoster[];
export function MatchRosterDataFactory(matchRosterObs: MatchRosterService["matchRoster$"]): ReportableDataSnapshot<MatchRosterDataOutput> {
    const mapPlayer = (rosterPlayer: MatchRosterPlayer) => ({
        isMe: rosterPlayer.isMe,
        name: rosterPlayer.name,
        teamId: rosterPlayer.teamId ?? -1,
        platformHardware: rosterPlayer.platformHardware,
        platformSoftware: rosterPlayer.platformSoftware,
    });

    return new ReportableDataSnapshot({
        dataId: "matchRoster",
        source$: matchRosterObs.pipe(map((matchRoster) => matchRoster.allPlayers.map((player) => mapPlayer(player)))),
    });
}
