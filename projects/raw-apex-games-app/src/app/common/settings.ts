export type SettingValue = BasicPrimitive | BasicPrimitive[];
export type AllSettings = { [key in SettingKey]: SettingValue };

export enum SettingKey {
    EnableLocalDBReporting = "enableLocalDBReporting",
    EnableAllInGameHUD = "enableAllInGameHUD",
    EnableInGameMatchTimerHUD = "enableInGameMatchTimerHUD",
    EnableInGameMiniInventoryHUD = "enableInGameMiniInventoryHUD",
    MinimizeToTray = "minimizeToTray",
}

export const DefaultSetting: { [P in SettingKey]: SettingValue } = {
    enableLocalDBReporting: true,
    enableAllInGameHUD: true,
    enableInGameMatchTimerHUD: true,
    enableInGameMiniInventoryHUD: true,
    minimizeToTray: false,
};
