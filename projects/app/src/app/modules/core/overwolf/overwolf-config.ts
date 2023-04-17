import { InjectionToken } from "@angular/core";

export const OW_CONFIG = new InjectionToken<OWConfig>("overwolf.config");
export interface OWConfig {
    REQUIRED_FEATURES_RETRY_COUNT: number;
    REQUIRED_FEATURES_RETRY_DELAY_MULTIPLIER: number;
    REQUIRED_FEATURES: string[];
    /** Time to check in-game connectivity */
    HEALTHCHECK_TIME: number;
    FEATURE_HEALTHCHECK_RETRY_COUNT: number;
    FEATURE_HEALTHCHECK_RETRY_DELAY_MULTIPLIER: number;
    /** Time to checks Overwolf's game event data status URL */
    FEATURE_HEALTHCHECK_TIME: number;
    APEXLEGENDSCLASSID: number;
}

export const OverwolfConfig: OWConfig = {
    REQUIRED_FEATURES_RETRY_COUNT: 5,
    REQUIRED_FEATURES_RETRY_DELAY_MULTIPLIER: 5000,
    REQUIRED_FEATURES: [
        "assist",
        "damage",
        "death",
        "game_info",
        "game_mode",
        "healed_from_ko",
        "inUse",
        "inventory",
        "kill",
        "kill_feed",
        "knockdown",
        "knocked_out",
        "legendSelect",
        "location",
        "map_id",
        "match_end",
        "match_info",
        "match_start",
        "match_state",
        "match_summary",
        "name",
        "phase",
        "pseudo_match_id",
        "respawn",
        "roster",
        "tabs",
        "team_info",
        "teammate",
        "totalDamageDealt",
        "ultimate_cooldown",
        "victory",
        "weapons",
    ],
    HEALTHCHECK_TIME: 1 * 60 * 1000,
    FEATURE_HEALTHCHECK_RETRY_COUNT: 5,
    FEATURE_HEALTHCHECK_RETRY_DELAY_MULTIPLIER: 5000,
    FEATURE_HEALTHCHECK_TIME: 10 * 60 * 1000,
    APEXLEGENDSCLASSID: 21566,
};
