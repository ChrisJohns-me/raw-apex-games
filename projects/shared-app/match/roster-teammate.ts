import { Legend } from "../legend/legend";
import { MatchRosterPlayer } from "./roster-player";

export interface MatchRosterTeammate extends MatchRosterPlayer {
    legend?: Legend;
}
