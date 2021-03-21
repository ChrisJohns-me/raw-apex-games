import { GameMap } from "./game-map";
import { GameMode } from "./game-mode";
import { Legend } from "./legend";

export interface MatchSummary {
    legend?: Legend;
    map?: GameMap;
    gameMode?: GameMode;
    placement?: number;
    kills?: number;
    damage?: number;
    durationMs?: number;
}
