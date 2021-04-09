import { Legend } from "../legend";
import { MatchRosterPlayer } from "./match-roster-player";

export interface MatchRosterTeammate extends MatchRosterPlayer {
    legend?: Legend;
}
