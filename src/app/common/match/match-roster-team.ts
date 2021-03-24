import { PlayerStatus as TeamStatus } from "../player";
import { MatchRosterPlayer } from "./match-roster-player";

export { TeamStatus };

export interface MatchRosterTeam {
    teamId: number;
    members: MatchRosterPlayer[];
}
