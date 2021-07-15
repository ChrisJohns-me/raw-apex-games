export interface Configuration {
    common: Common;
    featureFlags: FeatureFlags;
    featureConfigs: FeatureConfigs;
    general: General;
}

export interface Common {}

/**
 * Features / mini-features that can be enabled or disabled.
 */
export interface FeatureFlags {}

/**
 * Configuration settings for features / mini-features; not enabling or disabling.
 */
export interface FeatureConfigs {}

export interface General {
    /** ${0} = Overwolf Game ID */
    overwolfGameStatusUrl: string;
}
