export enum GameClassId {
    ApexLegends = 21566,
}

/**
 *
 */
export enum GameStage {
    Lobby = "lobby",
    LegendSelection = "legend_selection",
    InGameDropship = "in_game_dropship",
    InGame = "in_game",
    InGameKnocked = "in_game_knocked",
    InGameSpectating = "in_game_spectating",
    MatchSummary = "match_summary",
}

export type GameProcessUpdate = overwolf.games.GameInfoUpdatedEvent | undefined;
export type GameInfo = overwolf.gep.ApexLegends.ApexLegendsGameEvent2Info | undefined;
export type GameEvent = overwolf.gep.ApexLegends.ApexLegendsGameEventData | undefined;
export type NewGameEvents = overwolf.gep.ApexLegends.ApexLegendsNewGameEvents | undefined;
export type SquadmatePlayer = overwolf.gep.ApexLegends.ApexLegendsMatchInfoLegendSelect | undefined;
export type TeammateMatchInfo = overwolf.gep.ApexLegends.ApexLegendsMatchInfoTeammate | undefined;
export interface GamePlayerLocation {
    x: number;
    y: number;
    z: number;
}
