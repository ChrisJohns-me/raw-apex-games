import { InflictionInsightType } from "../modules/HUD/infliction-insight/windows/infliction-insight-window.component";
import { AimingReticleList } from "../modules/HUD/reticle-helper/components/aiming-reticle/aiming-reticles";
import { UltimateTimerType } from "../modules/HUD/ult-timer/windows/ult-timer-window.component";

export type SettingValue = BasicPrimitive | BasicPrimitive[];
export type AllSettings = { [key in SettingKey]: SettingValue };

export enum SettingKey {
    EnableLocalDBReporting = "enableLocalDBReporting",
    EnableAllInGameHUD = "enableAllInGameHUD",
    EnableInGameMatchTimerHUD = "enableInGameMatchTimerHUD",
    EnableInGameMiniInventoryHUD = "enableInGameMiniInventoryHUD",
    InflictionInsightType = "inflictionInsightType",
    EnableInGameHealingHelperHUD = "enableInGameHealingHelperHUD",
    EnableAllLegendSelectHUD = "enableAllLegendSelectHUD",
    EnableLegendSelectLegendStats = "enableLegendSelectLegendStats",
    EnableLegendSelectLegendSuggestions = "enableLegendSelectLegendSuggestions",
    EnableInGameAimingReticle = "enableInGameAimingReticle",
    UltimateTimerType = "ultimateTimerType",
    InGameAimingReticleId = "inGameAimingReticleId",
    InGameAimingReticleColor = "inGameAimingReticleColor",
    InGameAimingReticleAlpha = "inGameAimingReticleAlpha",
    InGameAimingReticleDynamicHide = "inGameAimingReticleDynamicHide",
    MinimizeToTray = "minimizeToTray",
}

export const DefaultSetting: { [P in SettingKey]: SettingValue } = {
    enableLocalDBReporting: true,
    enableAllInGameHUD: true,
    enableInGameMatchTimerHUD: true,
    enableInGameMiniInventoryHUD: true,
    inflictionInsightType: InflictionInsightType.Digits,
    enableInGameHealingHelperHUD: true,
    enableAllLegendSelectHUD: true,
    enableLegendSelectLegendStats: true,
    enableLegendSelectLegendSuggestions: true,
    enableInGameAimingReticle: false,
    ultimateTimerType: UltimateTimerType.TimeTotal,
    inGameAimingReticleId: AimingReticleList[0].reticleId,
    inGameAimingReticleColor: AimingReticleList[0].hexColor,
    inGameAimingReticleAlpha: AimingReticleList[0].alpha,
    inGameAimingReticleDynamicHide: false,
    minimizeToTray: false,
};
