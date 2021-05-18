export type SettingValue = Primitive;

export enum SettingKey {
    EnableAllInGameHUD = "enableAllInGameHUD",
    EnableInGameMatchTimerHUD = "enableInGameMatchTimerHUD",
    EnableInGameUltimateTimerHUD = "enableInGameUltimateTimerHUD",
    EnableInGameInflictionInsightHUD = "enableInGameInflictionInsightHUD",
    EnableAllLegendSelectHUD = "enableAllLegendSelectHUD",
    EnableLegendSelectLegendStatsHUD = "enableLegendSelectLegendStatsHUD",
    EnableLegendSelectLegendSuggestionsHUD = "enableLegendSelectLegendSuggestionsHUD",
}

export const DefaultSettings: { [P in SettingKey]: SettingValue } = {
    enableAllInGameHUD: true,
    enableInGameMatchTimerHUD: true,
    enableInGameUltimateTimerHUD: true,
    enableInGameInflictionInsightHUD: true,
    enableAllLegendSelectHUD: true,
    enableLegendSelectLegendStatsHUD: true,
    enableLegendSelectLegendSuggestionsHUD: true,
};
