// export type OWGameInfoUpdatedEvent = overwolf.games.GameInfoUpdatedEvent;
export type OWDisplay = overwolf.utils.Display;
export type OWExtensionUpdateState = overwolf.extensions.ExtensionUpdateState;
export type OWGameEvent = overwolf.gep.ApexLegends.GameEvent;
export type OWGameEventKillFeed = overwolf.gep.ApexLegends.GameEventKillFeed;
export type OWGetManifestResult = overwolf.extensions.GetManifestResult;
export type OWHotKey = overwolf.settings.hotkeys.IHotkey;
export type OWHotKeyAssignHotkeyObject = overwolf.settings.hotkeys.AssignHotkeyObject;
export type OWHotKeyGetAssignedHotkeyResult = overwolf.settings.hotkeys.GetAssignedHotkeyResult;
export type OWHotKeyOnChangedEvent = overwolf.settings.hotkeys.OnChangedEvent;
export type OWHotKeyOnPressedEvent = overwolf.settings.hotkeys.OnPressedEvent;
export type OWHotKeyUnassignHotkeyObject = overwolf.settings.hotkeys.UnassignHotkeyObject;
export type OWInfoUpdates2Event = overwolf.gep.ApexLegends.InfoUpdates2Event; // overwolf.games.events.InfoUpdates2Event
export type OWMatchInfo = overwolf.gep.ApexLegends.MatchInfo;
export type OWMatchInfoLegendSelect = overwolf.gep.ApexLegends.MatchInfoLegendSelect;
export type OWMatchInfoMe = overwolf.gep.ApexLegends.MatchInfoMe;
export type OWMatchInfoMeInventory = overwolf.gep.ApexLegends.MatchInfoMeInventory;
export type OWMatchInfoMeWeapons = overwolf.gep.ApexLegends.MatchInfoMeWeapons;
export type OWMatchInfoRoster = overwolf.gep.ApexLegends.MatchInfoRoster;
export type OWMatchInfoTeammate = overwolf.gep.ApexLegends.MatchInfoTeammate;
export type OWMouseEvent = overwolf.games.inputTracking.MouseEvent;
export type OWNewGameEvents = overwolf.gep.ApexLegends.NewGameEvents; // overwolf.games.events.NewGameEvents
export type OWRunningGameInfo = overwolf.games.RunningGameInfo;
export type OWStopStreamingEvent = overwolf.streaming.StopStreamingEvent;
export type OWStopStreamingResult = overwolf.streaming.StopStreamingResult;
export type OWStreamEvent = overwolf.streaming.StreamEvent;
export type OWStreamResult = overwolf.streaming.StreamResult;
export type OWStreamSettings = overwolf.streaming.StreamSettings;
export type OWSystemTrayMenuItem = overwolf.os.tray.menu_item;
export type OWVideoSplitedEvent = overwolf.streaming.VideoFileSplitedEvent;
export type OWWindowInfo = overwolf.windows.WindowInfo;

/**********************/
/*****CORRECTIONS******/
/**********************/
export interface OWAppLaunchTriggeredEvent extends overwolf.extensions.AppLaunchTriggeredEvent {
    origin:
        | "dock" // Launched from the Overwolf dock
        | "gamelaunchevent" // Auto-launched along with a game
        | "hotkey" // Launched in-game with a hotkey
        | "storeapi" // Launched from the store
        | "odk" // Launched with the overwolf.extensions.launch API
        | "commandline" // Launched from the command line using overwolf.exe -launchapp [extension id]
        | "tray" // Launched from the tray
        | "startup" // Launched upon startup (like remote configurations)
        | "after-install" // Auto-launched after installation
        | "overwolfstartlaunchevent" // Auto-launched with the client launch (when app auto-launch with Overwolf is enabled)
        | "urlscheme"; // Launched from custom link. See the process_name manifest flag
    parameter: string;
}
