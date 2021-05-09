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
        "death",
        "kill",
        "match_state",
        "me",
        "revive",
        "team",
        "roster",
        "kill_feed",
        "rank",
        "match_summary",
        "location",
        "match_info",
        "phase",
        "victory",
        "damage",
        "inventory",
    ],
    HEALTHCHECK_TIME: 1 * 60 * 1000,
    FEATURE_HEALTHCHECK_RETRY_COUNT: 5,
    FEATURE_HEALTHCHECK_RETRY_DELAY_MULTIPLIER: 5000,
    FEATURE_HEALTHCHECK_TIME: 10 * 60 * 1000,
    APEXLEGENDSCLASSID: 21566,
};
