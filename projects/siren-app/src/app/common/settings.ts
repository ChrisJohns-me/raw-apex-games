export type SettingValue = BasicPrimitive | BasicPrimitive[];
export type AllSettings = { [key in SettingKey]: SettingValue };

export enum SettingKey {
    EnableAllInGameHUD = "enableAllInGameHUD",
}

export const DefaultSetting: { [P in SettingKey]: SettingValue } = {
    enableAllInGameHUD: true,
};
