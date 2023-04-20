import { Legend } from "../legend/legend.js";
import { MatchRosterPlayer } from "./roster-player.js";

export interface MatchRosterTeammate extends MatchRosterPlayer {
    legend?: Legend;
}
