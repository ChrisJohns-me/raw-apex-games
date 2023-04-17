/**
 * This list is also used to check feature status.
 * If an unsupported/unavailable feature is not listed here, it will be ignored.
 * These should generally all be registered with Overwolf.
 */
export enum OverwolfFeatureDep {
    // /** @deprecated */
    // ArenaScore = "arena_score",
    Assist = "assist",
    Damage = "damage",
    Death = "death",
    GameInfo = "game_info",
    GameMode = "game_mode",
    HealedFromKo = "healed_from_ko",
    InUse = "inUse",
    Inventory = "inventory",
    Kill = "kill",
    KillFeed = "kill_feed",
    Knockdown = "knockdown",
    KnockedOut = "knocked_out",
    LegendSelect = "legendSelect",
    Location = "location",
    MapId = "map_id",
    MatchEnd = "match_end",
    MatchInfo = "match_info",
    MatchStart = "match_start",
    MatchState = "match_state",
    MatchSummary = "match_summary",
    Name = "name",
    Phase = "phase",
    PseudoMatchId = "pseudo_match_id",
    Respawn = "respawn",
    Roster = "roster",
    Tabs = "tabs",
    TeamInfo = "team_info",
    Teammate = "teammate",
    TotalDamageDealt = "totalDamageDealt",
    UltimateCooldown = "ultimate_cooldown",
    Victory = "victory",
    Weapons = "weapons",
}

export enum FeatureState {
    Unsupported = 0,
    Good = 1,
    Partial = 2,
    Unavailable = 3,
}

export type FeatureStates = {
    [eventName in OverwolfFeatureDep]?: FeatureState;
};
