export interface Configuration {
    featureFlags: FeatureFlags;
    assumptions: Assumptions;
}

export interface Assumptions {
    opponentShieldDefault: number;
    opponentHealthDefault: number;
    isRosterNullPlayerDisconnect: boolean;
}

export interface FeatureFlags {
    matchTimerWindow: boolean;
    ultTimerWindow: boolean;
    inflictionInsightWindow: boolean;
}
