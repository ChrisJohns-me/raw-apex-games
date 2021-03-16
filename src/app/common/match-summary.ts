import { GameMap } from "./game-map";
import { Legend } from "./legend";
import { GameMode } from "./match";

export interface MatchSummary {
    legend?: Legend;
    map?: GameMap;
    gameMode?: GameMode;
    placement?: number;
    kills?: number;
    damage?: number;
    durationMs?: number;
}
