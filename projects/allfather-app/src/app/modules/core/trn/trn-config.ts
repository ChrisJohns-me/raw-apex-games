import { InjectionToken } from "@angular/core";
import { TRNPlatformTypes } from "./interfaces";

export const TRN_CONFIG = new InjectionToken<TRNConfig>("trn.config");
export interface TRNConfig {
    API_KEY: string;
    playerProfileUrl: (platform: TRNPlatformTypes, platformUserIdentifier: string) => string;
    getStatSegmentUrl: (platform: TRNPlatformTypes, platformUserIdentifier: string, segmentType: string) => string;
    bulkProfileUrl: string;
}

export const trnConfig: TRNConfig = {
    API_KEY: "fcda40ef-2a47-4947-95fd-14d9e8f39d22",
    playerProfileUrl: (platform: TRNPlatformTypes, platformUserIdentifier: string) =>
        `https://public-api.tracker.gg/v2/apex/standard/profile/${platform}/${platformUserIdentifier}`,
    getStatSegmentUrl: (platform: TRNPlatformTypes, platformUserIdentifier: string, segmentType: string) =>
        `https://public-api.tracker.gg/v2/apex/standard/profile/${platform}/${platformUserIdentifier}/segments/${segmentType}`,
    bulkProfileUrl: `https://apex.tracker.gg/api/v2/standard/apex/overwolfBulk`,
};
