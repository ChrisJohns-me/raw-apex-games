import { MatchRing } from "@raw-apex-games-app/app/common/match/ring";

export interface Configuration {
    assumptions: Assumptions;
    common: Common;
    brFacts: BRFacts;
    facts: Facts;
    featureFlags: FeatureFlags;
    featureConfigs: FeatureConfigs;
    general: General;
    overwolfQuirks: OverwolfQuirks;
}

export interface Assumptions {
    /** Amount to assume opponent's shields start at */
    opponentShieldDefault: number;
    /** Amount to assume opponent's health start at */
    opponentHealthDefault: number;
    isRosterNullPlayerDisconnect: boolean;
    /** Time in ms before player is assumed to be revived */
    knockdownExpireTime: number;
    /** Time in ms before player is assumed to be respawned after elimination */
    eliminationExpireTime: number;
}

export interface Common {
    /** Time in ms to leave relevant HUD UI elements up after player dies */
    playerDeathHUDTimeout: number;
    /** Time in ms to leave relevant HUD UI elements up after match ends */
    matchEndHUDTimeout: number;
}

export interface BRFacts {
    /** Time in ms before respawn banner expires where teammates can grab banner */
    respawnBannerExpireTime: number;
    /** Largest ultimate ability cooldown time possible */
    maxUltimateCooldownTime: number;
    /** Absolute maximum possible number of players on one squad */
    maxSquadSize: number;
    /** Time in ms for damage from ring */
    ringDamageTickRate: number;
    rings: MatchRing[];
}

export interface Facts {
    /** Max amount of shields that is possible in the game */
    maxShield: number;
    /** Max amount of health that is possible in the game */
    maxHealth: number;
}

/**
 * Features / mini-features that can be enabled or disabled.
 */
export interface FeatureFlags {
    enableMatchTimerWindow: boolean;
    enableMiniInventoryWindow: boolean;
    enableMatchSummaryWindow: boolean;
    enableVideoCapture: boolean;
}

/**
 * Configuration settings for features / mini-features; not enabling or disabling.
 */
export interface FeatureConfigs {}

export interface General {
    enableMatchSummaryAd: boolean;
}

export interface OverwolfQuirks {}
