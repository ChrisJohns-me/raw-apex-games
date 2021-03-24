import { Legend } from "@common/legend";
import { MatchRosterPlayer } from "./match-roster-player";

export interface MatchRosterTeammate extends MatchRosterPlayer {
    legend?: Legend;
}
