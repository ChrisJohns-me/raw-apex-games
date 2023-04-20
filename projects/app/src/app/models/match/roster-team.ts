import { PlayerState as TeamState } from "../player-state.js";
import { MatchRosterPlayer } from "./roster-player.js";

export { TeamState };

export interface MatchRosterTeam<T extends MatchRosterPlayer = MatchRosterPlayer> {
    teamId: number;
    members: T[];
}
