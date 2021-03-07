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
    InGameDropping = "in_game_dropping",
    InGame = "in_game",
    InGameKnocked = "in_game_knocked",
    InGameSpectating = "in_game_spectating",
}

export type GameProcessUpdate = overwolf.games.GameInfoUpdatedEvent | undefined;
export type GameInfo = overwolf.gep.ApexLegends.ApexLegendsGameEvent2Info | undefined;
export type GameEvent = overwolf.gep.ApexLegends.ApexLegendsGameEventData | undefined;
export type NewGameEvents = overwolf.gep.ApexLegends.ApexLegendsNewGameEvents | undefined;
export type SquadmatePlayer = overwolf.gep.ApexLegends.ApexLegendsMatchInfoLegendSelect | undefined;
export type TeammateMatchInfo = overwolf.gep.ApexLegends.ApexLegendsMatchInfoTeammate | undefined;

export interface MapCoordinates {
    x: number;
    y: number;
    z: number;
}

export interface GameTime {
    start?: Date;
    end?: Date;
    durationMs: number;
}

export enum PlatformHardware {
    Xbox = 0,
    PlayStation = 1,
    PC = 2,
}

export enum PlatformSoftware {
    Xbox = 0,
    PlayStation = 1,
    Origin = 2,
    Steam = 7,
}
