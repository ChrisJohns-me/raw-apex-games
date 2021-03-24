import { PlayerState as TeamState } from "../player-state";
import { MatchRosterPlayer } from "./match-roster-player";

export { TeamState };

export interface MatchRosterTeam<T extends MatchRosterPlayer> {
    teamId: number;
    members: T[];
}
