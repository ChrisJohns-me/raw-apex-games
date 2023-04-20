import { MatchRosterPlayer } from "@app/models/match/roster-player.js";
import { PlatformHardware, PlatformSoftware } from "@app/models/platform.js";
import { MatchRosterService } from "@app/modules/core/match/match-roster.service.js";
import { map } from "rxjs/operators";
import { ReportableDataSnapshot } from "../reportable-data.js";

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
