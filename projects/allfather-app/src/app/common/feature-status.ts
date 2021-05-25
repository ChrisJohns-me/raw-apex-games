export enum OverwolfFeatureDep {
    Assist = "assist",
    Damage = "damage",
    Death = "death",
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
    MatchEnd = "match_end",
    MatchStart = "match_start",
    MatchState = "match_state",
    MatchSummary = "match_summary",
    Name = "name",
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

export type FeatureStatusList = {
    [eventName in OverwolfFeatureDep]?: FeatureState;
};
