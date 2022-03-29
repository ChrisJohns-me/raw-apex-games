import { AimingReticleList } from "../modules/HUD/reticle-helper/components/aiming-reticle/aiming-reticles";

export type SettingValue = BasicPrimitive | BasicPrimitive[];
export type AllSettings = { [key in SettingKey]: SettingValue };

export enum SettingKey {
    EnableAllInGameHUD = "enableAllInGameHUD",
    EnableInGameMatchTimerHUD = "enableInGameMatchTimerHUD",
    EnableInGameMiniInventoryHUD = "enableInGameMiniInventoryHUD",
    EnableInGameUltimateTimerHUD = "enableInGameUltimateTimerHUD",
    EnableInGameInflictionInsightHUD = "enableInGameInflictionInsightHUD",
    EnableAllLegendSelectHUD = "enableAllLegendSelectHUD",
    EnableLegendSelectLegendStats = "enableLegendSelectLegendStats",
    EnableLegendSelectLegendSuggestions = "enableLegendSelectLegendSuggestions",
    EnableInGameAimingReticle = "enableInGameAimingReticle",
    InGameAimingReticleId = "inGameAimingReticleId",
    InGameAimingReticleColor = "inGameAimingReticleColor",
    InGameAimingReticleAlpha = "inGameAimingReticleAlpha",
    InGameAimingReticleDynamicHide = "inGameAimingReticleDynamicHide",
}

export const DefaultSetting: { [P in SettingKey]: SettingValue } = {
    enableAllInGameHUD: true,
    enableInGameMatchTimerHUD: true,
    enableInGameMiniInventoryHUD: true,
    enableInGameUltimateTimerHUD: true,
    enableInGameInflictionInsightHUD: true,
    enableAllLegendSelectHUD: true,
    enableLegendSelectLegendStats: true,
    enableLegendSelectLegendSuggestions: true,
    enableInGameAimingReticle: false,
    inGameAimingReticleId: AimingReticleList[0].reticleId,
    inGameAimingReticleColor: AimingReticleList[0].hexColor,
    inGameAimingReticleAlpha: AimingReticleList[0].alpha,
    inGameAimingReticleDynamicHide: false,
};
