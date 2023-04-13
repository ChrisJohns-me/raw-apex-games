export interface Configuration {
    featureFlags: FeatureFlags;
    featureConfigs: FeatureConfigs;
    general: General;
    overwolfQuirks: OverwolfQuirks;
}

/**
 * Features / mini-features that can be enabled or disabled.
 */
export interface FeatureFlags {
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
