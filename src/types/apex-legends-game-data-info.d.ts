type GameDataInfo = overwolf.games.events.InfoUpdates2Event;

declare const enum ApexLegendsDataInfoFeatureName {
    MatchState = "match_state",
    Team = "team",
    Inventory = "inventory",
    Roster = "roster",
    MatchSummary = "match_summary",
}

declare const enum ApexLegendsDataInfoName {
    Me = "me",
    MatchInfo = "match_info",
    GameInfo = "game_info",
}

declare interface ApexLegendsGameDataInfo extends GameDataInfo {
    info: { [key in ApexLegendsDataInfoName]: unknown };
    feature: ApexLegendsDataInfoFeatureName;
}
