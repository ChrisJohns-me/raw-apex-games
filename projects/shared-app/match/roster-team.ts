import { PlayerState as TeamState } from "../player-state";
import { MatchRosterPlayer } from "./roster-player";

export { TeamState };

export interface MatchRosterTeam<T extends MatchRosterPlayer = MatchRosterPlayer> {
    teamId: number;
    members: T[];
}
