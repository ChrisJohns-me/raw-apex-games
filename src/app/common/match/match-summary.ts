import { Legend } from "../legend";
import { MatchGameMode } from "./match-game-mode";
import { MatchMap } from "./match-map";

export interface MatchSummary {
    legend?: Legend;
    map?: MatchMap;
    gameMode?: MatchGameMode;
    placement?: number;
    eliminations?: number;
    damage?: number;
    durationMs?: number;
}
