export type SettingValue = BasicPrimitive;
export type AllSettings = { [key in SettingKey]: SettingValue };

export enum SettingKey {
    EnableAllInGameHUD = "enableAllInGameHUD",
    EnableInGameMatchTimerHUD = "enableInGameMatchTimerHUD",
    EnableInGameUltimateTimerHUD = "enableInGameUltimateTimerHUD",
    EnableInGameInflictionInsightHUD = "enableInGameInflictionInsightHUD",
    EnableAllLegendSelectHUD = "enableAllLegendSelectHUD",
    EnableLegendSelectLegendStats = "enableLegendSelectLegendStats",
    EnableLegendSelectLegendSuggestions = "enableLegendSelectLegendSuggestions",
}

export const DefaultSetting: { [P in SettingKey]: SettingValue } = {
    enableAllInGameHUD: true,
    enableInGameMatchTimerHUD: true,
    enableInGameUltimateTimerHUD: true,
    enableInGameInflictionInsightHUD: true,
    enableAllLegendSelectHUD: true,
    enableLegendSelectLegendStats: true,
    enableLegendSelectLegendSuggestions: true,
};
