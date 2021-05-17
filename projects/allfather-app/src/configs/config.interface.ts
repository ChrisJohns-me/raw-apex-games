export interface Configuration {
    assumptions: Assumptions;
    common: Common;
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
    /** Time in ms to throttle location data. Changing this affects past heatmap graphs. */
    locationDataThrottleTime: number;
}

export interface Facts {
    /** Time in ms before respawn banner expires where teammates can grab banner */
    respawnBannerExpireTime: number;
    /** Max amount of shields that is possible in the game */
    maxShield: number;
    /** Max amount of health that is possible in the game */
    maxHealth: number;
    /** Largest ultimate ability cooldown time possible */
    maxUltimateCooldownTime: number;
    /** Absolute maximum possible number of players on one squad */
    maxSquadSize: number;
}

/**
 * Features / mini-features that can be enabled or disabled.
 */
export interface FeatureFlags {
    enableMatchTimerWindow: boolean;
    enableUltTimerWindow: boolean;
    enableInflictionInsightWindow: boolean;
    inflictionInsight: {
        /** Show non-damaged teammates' shields */
        showAssumedOpponentTeammateShields: boolean;
        /** Show non-damaged teammates' health */
        showAssumedOpponentTeammateHealth: boolean;
        assumeKnockdownExpires: boolean;
        assumeEliminationExpires: boolean;
    };
    legendSelectAssist: {
        legendStats: boolean;
        complimentaryLegends: boolean;
    };
}

/**
 * Configuration settings for features / mini-features; not enabling or disabling.
 */
export interface FeatureConfigs {
    inflictionInsight: {
        /** Time in ms to force refresh the UI */
        refreshTime: number;
        /** Time in ms before damage accumulation is reset */
        damageResetTime: number;
    };
    legendSelectAssist: {
        /** How many matches are required to show stats for legends */
        minLegendStatsMatches: number;
        /** How many complimentary legends to show */
        maxComplimentaryLegends: number;
        /** How many matches are required to show complimentary legends */
        minShowComplimentaryLegendsMatches: number;
        /** Number of matches to use to calculate legend stats */
        limitLegendStatsMatches: number;
        /** Number of matches to use to calculate complimentary legends */
        limitComplimentaryLegendsMatches: number;
        /** Weight distrubution used to calculate complimentary legends */
        complimentaryLegendsWeights: {
            winWeight: number;
            placementWeight: number;
            damageWeight: number;
            eliminationWeight: number;
            knockdownWeight: number;
            durationWeight: number;
        };
        legendRows: {
            /** Row's distance from top of screen */
            top: number;
            /** Row's distance from right of screen */
            right: number;
            /** Legends in the row, in order */
            legendIds: string[];
        }[];
    };
    ultTimer: {
        /** Time in ms to force refresh the UI */
        refreshTime: number;
        /** Number of percents to keep for calculation */
        maxHistoryCount: number;
        /** Minimum percent amount of confidence that the ready date is deemed accurate */
        highConfidenceAmount: number;
        /** Minimum percent amount of confidence to display the ultimate timer at all */
        lowConfidenceAmount: number;
    };
}

export interface General {
    /** ${0} = Overwolf Game ID */
    overwolfGameStatusUrl: string;
}

export interface OverwolfQuirks {}

export type ConfigPositionXAnchor = "left" | "center" | "right";
export type ConfigPositionYAnchor = "top" | "middle" | "bottom";
export type ConfigPositionUnit = "percent" | "pixel";
export interface ConfigWindowPosition {
    x: number;
    y: number;
}
export interface UIContainers {
    inflictionInsight: {
        defaultPosition: ConfigWindowPosition;
        positionUnit: ConfigPositionUnit;
        positionXAnchor: ConfigPositionXAnchor;
        positionYAnchor: ConfigPositionYAnchor;
    };
}
