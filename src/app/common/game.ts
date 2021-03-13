export enum GameClassId {
    ApexLegends = 21566,
}

export enum GamePhase {
    Lobby = "lobby",
    LegendSelection = "legend_selection",
    InGame = "in_game",
}

/**
 *
 */
// export enum GameStage {
//     Lobby = "lobby",
//     LegendSelection = "legend_selection",
//     InGameDropship = "in_game_dropship",
//     InGameDropping = "in_game_dropping",
//     InGame = "in_game",
//     InGameKnocked = "in_game_knocked",
//     InGameSpectating = "in_game_spectating",
// }

export type GameProcessUpdate = overwolf.games.GameInfoUpdatedEvent | undefined;
export type GameInfo = overwolf.gep.ApexLegends.InfoUpdates2 | undefined;
export type GameEvent = overwolf.gep.ApexLegends.EventData | undefined;
export type NewGameEvents = overwolf.gep.ApexLegends.NewGameEvents | undefined;
export type SquadmatePlayer = overwolf.gep.ApexLegends.MatchInfoLegendSelect | undefined;
export type TeammateMatchInfo = overwolf.gep.ApexLegends.MatchInfoTeammate | undefined;

export interface GameTime {
    start?: Date;
    end?: Date;
    durationMs: number;
}
