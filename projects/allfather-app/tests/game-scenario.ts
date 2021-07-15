import { MockOverwolfAPI } from "@shared-app/mocks/mock-overwolf-api";
import { JSONTryParse } from "common/utilities/";
import { unique } from "common/utilities/primitives/array";
import { addMilliseconds, differenceInMilliseconds } from "date-fns";

const MAX_DURATION = 3600000;

//#region Event Strings
const eventMatchStart = () => `{"name":"match_start","data":"null"}`;
const eventMatchEnd = () => `{"name":"match_end","data":"null"}`;
const eventKillFeed = (localPlayerName: string, attackerName: string, victimName: string, weaponName: string, action: string) =>
    `{"name":"kill_feed","data":"{\\"local_player_name\\":\\"${localPlayerName}\\",\\"attackerName\\":\\"${attackerName}\\",\\"victimName\\":\\"${victimName}\\",\\"weaponName\\":\\"${weaponName}\\",\\"action\\":\\"${action}\\"}"}`;
const eventDamage = (targetName: string, damageAmount: number, armor: boolean, headshot: boolean) =>
    `{"name":"damage","data":"{\\"targetName\\":\\"${targetName}\\",\\"damageAmount\\":\\"${damageAmount}.000000\\",\\"armor\\":\\"${armor}\\",\\"headshot\\":\\"${headshot}\\"}"}`;
const eventKnockdown = (victimName: string) => `{"name":"knockdown","data":"{\\"victimName\\":\\"${victimName}\\"}"}`;
const eventKill = (victimName: string) => `{"name":"kill","data":"{\\"victimName\\":\\"${victimName}\\"}"}`;
const eventPlayerKnockedDown = () => `{"name":"knocked_out","data":"null"}`;
const eventPlayerDeath = () => `{"name":"death","data":"null"}`;
const eventPlayerRespawn = () => `{"name":"respawn","data":"null"}`;
const eventPlayerHealedFromKO = () => `{"name":"healed_from_ko","data":"null"}`;
const infoMeName = (playerName: string) => `{"info":{"me":{"name":"${playerName}"}},"feature":"me"}`;
const infoMatchInfoGameMode = (gameMode: string) => `{"info":{"match_info":{"game_mode":"${gameMode}"}},"feature":"match_info"}`;
const infoMatchInfoRoster = (id: number, playerName: string, isTeammate: boolean, teamId: number, platformHw: number, platformSw: number) =>
    `{"info":{"match_info":{"roster_${id}":"{\\"name\\":\\"${playerName}\\",\\"isTeammate\\":${isTeammate},\\"team_id\\":${teamId},\\"platform_hw\\":${platformHw},\\"platform_sw\\":${platformSw}}"}},"feature":"roster"}`;
const infoMatchInfoTeammate = (id: number, playerName: string, state: string) =>
    `{"info":{"match_info":{"teammate_${id}":"{\\"name\\":\\"${playerName}\\",\\"state\\":\\"${state}\\"}"}},"feature":"team"}`;
const infoMatchInfoLegendSelect = (id: number, playerName: string, legendName: string, selectionOrder: number, isLead: boolean) =>
    `{"info":{"match_info":{"legendSelect_${id}":"{\\"playerName\\":\\"${playerName}\\",\\"legendName\\":\\"${legendName}\\",\\"selectionOrder\\":\\"${selectionOrder}\\",\\"lead\\":${isLead}}"}},"feature":"team"}`;
const infoMatchInfoPseudoMatchId = (matchId: string) => `{"info":{"match_info":{"pseudo_match_id":"${matchId}"}},"feature":"match_info"}`;
const infoMeTotalDamageDealt = (total: number) => `{"info":{"me":{"totalDamageDealt":"${total}"}},"feature":"damage"}`;
const infoMatchInfoTeamInfoState = (teamState: string) =>
    `{"info":{"match_info":{"team_info":"{\\"team_state\\":\\"${teamState}\\"}"}},"feature":"team"}`;
const infoMeInUse = (inUse: string) => `{"info":{"me":{"inUse":"{\\"inUse\\":\\"${inUse}\\"}"}},"feature":"inventory"}`;
const infoMeWeapons = (weapon0?: string, weapon1?: string) => {
    if (!weapon0 && !weapon1) return `{"info":{"me":{"weapons":""}},"feature":"inventory"}`;
    return `{"info":{"me":{"weapons":"{ \\"weapon0\\":\\"${weapon0}\\", \\"weapon1\\":\\"${weapon1}\\" }"}},"feature":"inventory"}`;
};
const infoMatchInfoVictory = (value?: string) => `{"info":{"match_info":{"victory":"${value}"}},"feature":"rank"}`;
const infoMatchInfoLocation = (x: number, y: number, z: number) =>
    `{"info":{"match_info":{"location":"{\\"x\\":\\"${x}\\",\\"y\\":\\"${y}\\",\\"z\\":\\"${z}\\"}"}},"feature":"location"}`;
const infoGameInfoMatchState = (matchState: string) => `{"info":{"game_info":{"match_state":"${matchState}"}},"feature":"match_state"}`;
const infoMatchInfoTabs = (
    kills?: number,
    assists?: number,
    spectators?: number,
    teams?: number,
    players?: number,
    damage?: number,
    cash?: number
) => {
    if (kills == null && assists == null && spectators == null && teams == null && players == null && damage == null && cash == null)
        return `{"info":{"match_info":{"tabs":"null"}},"feature":"match_info"}`;
    else
        return `{"info":{"match_info":{"tabs":"{\\"kills\\":${kills},\\"assists\\":${assists},\\"spectators\\":${spectators},\\"teams\\":${teams},\\"players\\":${players},\\"damage\\":${damage},\\"cash\\":${cash}}"}},"feature":"match_info"}`;
};
const infoMeUltimateCooldown = (ultimateCooldown: number) =>
    `{"info":{"me":{"ultimate_cooldown":"{\\"ultimate_cooldown\\":\\"${ultimateCooldown}\\"}"}},"feature":"me"}`;
const infoMeInventory = (id: number, name: string, amount: number) =>
    `{"info":{"me":{"inventory_${id}":"{\\"name\\":\\"${name}\\",\\"amount\\":\\"${amount}\\"}"}},"feature":"inventory"}`;

//#endregion

type Timestamp<T> = { timestamp: Date; value: T };

interface GameScenarioConstructor {
    matchId: string;
    myName: string;
    matchStartDate: Date;
    lobbyStartDate: Date;
    legendSelectStartDate: Date;
    preGameStartDate: Date;
    matchEndDate: Date;
    gameMode?: string;
    locationHistory?: Timestamp<overwolf.gep.ApexLegends.MatchInfoLocation>[];
    ultimateCooldownHistory?: Timestamp<number>[];
    teammates?: overwolf.gep.ApexLegends.MatchInfoRoster[];
    legendSelects?: overwolf.gep.ApexLegends.MatchInfoLegendSelect[];
    roster?: overwolf.gep.ApexLegends.MatchInfoRoster[];
    killfeedHistory?: Timestamp<overwolf.gep.ApexLegends.GameEventKillFeed>[];
    damageEventHistory?: Timestamp<overwolf.gep.ApexLegends.GameEventDamage>[];
    knockdownEventHistory?: Timestamp<overwolf.gep.ApexLegends.GameEventKnockdown>[];
    killEventHistory?: Timestamp<overwolf.gep.ApexLegends.GameEventKill>[];
    infoTabsHistory?: Timestamp<overwolf.gep.ApexLegends.MatchInfoTabs>[];
    playerRespawnEventHistory?: Timestamp<void>[];
    playerKnockedDownEventHistory?: Timestamp<void>[];
    playerHealedFromKOEventHistory?: Timestamp<void>[];
    playerDeathEventHistory?: Timestamp<void>[];
    playerInventoryHistory?: Timestamp<overwolf.gep.ApexLegends.MatchInfoMeInventory>[];
    playerWeaponHistory?: Timestamp<overwolf.gep.ApexLegends.MatchInfoMeWeapons>[];
    playerInUseHistory?: Timestamp<overwolf.gep.ApexLegends.MatchInfoMeInUse>[];
}

/**
 * Creates a simulated game scenario.
 */
export class GameScenario implements GameScenarioConstructor {
    public matchId: string;
    public myName: string;
    public matchStartDate: Date;
    public lobbyStartDate: Date;
    public legendSelectStartDate: Date;
    public preGameStartDate: Date;
    public matchEndDate: Date;
    public gameMode?: string;
    public locationHistory?: Timestamp<overwolf.gep.ApexLegends.MatchInfoLocation>[];
    public ultimateCooldownHistory?: Timestamp<number>[];
    public teammates?: overwolf.gep.ApexLegends.MatchInfoRoster[] = [];
    public legendSelects?: overwolf.gep.ApexLegends.MatchInfoLegendSelect[] = [];
    public roster?: overwolf.gep.ApexLegends.MatchInfoRoster[] = [];
    public killfeedHistory?: Timestamp<overwolf.gep.ApexLegends.GameEventKillFeed>[] = [];
    public damageEventHistory?: Timestamp<overwolf.gep.ApexLegends.GameEventDamage>[] = [];
    public knockdownEventHistory?: Timestamp<overwolf.gep.ApexLegends.GameEventKnockdown>[] = [];
    public killEventHistory?: Timestamp<overwolf.gep.ApexLegends.GameEventKill>[] = [];
    public infoTabsHistory?: Timestamp<overwolf.gep.ApexLegends.MatchInfoTabs>[] = [];
    public playerRespawnEventHistory?: Timestamp<void>[] = [];
    public playerKnockedDownEventHistory?: Timestamp<void>[] = [];
    public playerHealedFromKOEventHistory?: Timestamp<void>[] = [];
    public playerDeathEventHistory?: Timestamp<void>[] = [];
    /** @todo */
    public playerInventoryHistory?: Timestamp<overwolf.gep.ApexLegends.MatchInfoMeInventory>[] = [];
    public playerWeaponHistory?: Timestamp<overwolf.gep.ApexLegends.MatchInfoMeWeapons>[] = [];
    public playerInUseHistory?: Timestamp<overwolf.gep.ApexLegends.MatchInfoMeInUse>[] = [];

    constructor(public scenarioName: string, setup: GameScenarioConstructor, private mockOverwolfAPI: MockOverwolfAPI) {
        this.matchId = setup.matchId;
        this.myName = setup.myName;
        this.matchStartDate = setup.matchStartDate;
        this.lobbyStartDate = setup.lobbyStartDate;
        this.legendSelectStartDate = setup.legendSelectStartDate;
        this.preGameStartDate = setup.preGameStartDate;
        this.matchEndDate = setup.matchEndDate;
        if (setup.gameMode) this.gameMode = setup.gameMode;
        if (setup.locationHistory) this.locationHistory = setup.locationHistory;
        if (setup.ultimateCooldownHistory) this.ultimateCooldownHistory = setup.ultimateCooldownHistory;
        if (setup.teammates) this.teammates = setup.teammates;
        if (setup.legendSelects) this.legendSelects = setup.legendSelects;
        if (setup.roster) this.roster = setup.roster;
        if (setup.killfeedHistory) this.killfeedHistory = setup.killfeedHistory;
        if (setup.damageEventHistory) this.damageEventHistory = setup.damageEventHistory;
        if (setup.knockdownEventHistory) this.knockdownEventHistory = setup.knockdownEventHistory;
        if (setup.killEventHistory) this.killEventHistory = setup.killEventHistory;
        if (setup.infoTabsHistory) this.infoTabsHistory = setup.infoTabsHistory;
        if (setup.playerRespawnEventHistory) this.playerRespawnEventHistory = setup.playerRespawnEventHistory;
        if (setup.playerKnockedDownEventHistory) this.playerKnockedDownEventHistory = setup.playerKnockedDownEventHistory;
        if (setup.playerHealedFromKOEventHistory) this.playerHealedFromKOEventHistory = setup.playerHealedFromKOEventHistory;
        if (setup.playerDeathEventHistory) this.playerDeathEventHistory = setup.playerDeathEventHistory;
        if (setup.playerInventoryHistory) this.playerInventoryHistory = setup.playerInventoryHistory;
        if (setup.playerWeaponHistory) this.playerWeaponHistory = setup.playerWeaponHistory;
        if (setup.playerInUseHistory) this.playerInUseHistory = setup.playerInUseHistory;
    }

    /**
     * Utilizes Mocked Overwolf API to run the entire game scenario
     * Be sure to set Jasmine's Clock, as this utilizes `setTimeout()`
     * Resets and mocks Jasmine's Clock and ticks per each timestamp.
     */
    public run(): void {
        const fullGameLogs = this.generateFullGameLog();
        const parsedFullGame = this.parseGameLogs(fullGameLogs);
        this.validateTimestamps(parsedFullGame);
        this.runGameLoop(parsedFullGame);
    }

    private generateFullGameLog(): Timestamp<string>[] {
        return [
            ...this.generateInGameLobby(this.lobbyStartDate),
            ...this.generatePreGame(this.preGameStartDate),
            ...this.generateLegendSelection(this.legendSelectStartDate),
            ...this.generateMatchStart(this.matchStartDate),
            ...this.generateLocationEvents(),
            ...this.generateUltimateCooldown(),
            ...this.generatePlayerInUse(),
            ...this.generatePlayerWeapons(),
            ...this.generateKillFeed(),
            ...this.generateDamageEvents(),
            ...this.generateKnockdownEvents(),
            ...this.generateKillEvents(),
            ...this.generatePlayerEvents(),
            ...this.generateMatchEnd(this.matchEndDate),
        ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }

    private generateInGameLobby(initialDate = this.matchStartDate): Timestamp<string>[] {
        const inGameLobby: Timestamp<string>[] = [];
        if (this.myName) inGameLobby.push({ timestamp: addMilliseconds(initialDate, 0), value: infoMeName(this.myName) });
        if (this.gameMode) inGameLobby.push({ timestamp: addMilliseconds(initialDate, 1), value: infoMatchInfoGameMode(this.gameMode) });
        return inGameLobby;
    }

    private generatePreGame(initialDate = this.matchStartDate): Timestamp<string>[] {
        const preGame: Timestamp<string>[] = [];
        this.teammates?.forEach((teammate, index) => {
            preGame.push({
                timestamp: addMilliseconds(initialDate, index * 100),
                value: infoMatchInfoTeammate(index, teammate.name, "alive"),
            });
        });
        this.roster?.forEach((player, index) => {
            preGame.push({
                timestamp: addMilliseconds(initialDate, index * 10),
                value: infoMatchInfoRoster(index, player.name, player.isTeammate, player.team_id, player.platform_hw, player.platform_sw),
            });
        });
        return preGame;
    }

    private generateLegendSelection(initialDate = this.matchStartDate): Timestamp<string>[] {
        const legendSelection: Timestamp<string>[] = [];
        this.legendSelects?.forEach((legendSelect, index) => {
            const isLast = index === (this.legendSelects?.length ?? 0) - 1;
            legendSelection.push({
                timestamp: addMilliseconds(initialDate, index * 5 * 1000),
                value: infoMatchInfoLegendSelect(index, legendSelect.playerName, legendSelect.legendName, index, isLast),
            });
        });
        return legendSelection;
    }

    private generateMatchStart(initialDate = this.matchStartDate): Timestamp<string>[] {
        const matchStart: Timestamp<string>[] = [];
        const numTeams = unique(this.roster, (p) => p.team_id).length;
        const numPlayers = this.roster?.length ?? 0;

        matchStart.push({ timestamp: addMilliseconds(initialDate, 1), value: infoGameInfoMatchState("active") });
        matchStart.push({ timestamp: addMilliseconds(initialDate, 10), value: infoMatchInfoPseudoMatchId(this.matchId) });
        matchStart.push({ timestamp: addMilliseconds(initialDate, 10), value: infoMeTotalDamageDealt(0) });
        matchStart.push({ timestamp: addMilliseconds(initialDate, 10), value: eventMatchStart() });
        matchStart.push({ timestamp: addMilliseconds(initialDate, 100), value: infoMatchInfoVictory() });
        matchStart.push({ timestamp: addMilliseconds(initialDate, 100), value: infoMeInUse("null") });
        matchStart.push({ timestamp: addMilliseconds(initialDate, 100), value: infoMatchInfoTeamInfoState("active") });
        matchStart.push({ timestamp: addMilliseconds(initialDate, 100), value: infoMeInventory(0, "", 0) });
        matchStart.push({ timestamp: addMilliseconds(initialDate, 100), value: infoMatchInfoTabs(0, 0, 0, numTeams, numPlayers, 0, 0) });
        return matchStart;
    }

    private generateLocationEvents(): Timestamp<string>[] {
        const locationHistory: Timestamp<string>[] = [];
        this.locationHistory?.forEach((loc) => {
            locationHistory.push({
                timestamp: loc.timestamp,
                value: infoMatchInfoLocation(loc.value.x, loc.value.y, loc.value.z),
            });
        });
        return locationHistory;
    }

    private generateUltimateCooldown(): Timestamp<string>[] {
        const ultimateCooldown: Timestamp<string>[] = [];
        this.ultimateCooldownHistory?.forEach((ult) => {
            ultimateCooldown.push({
                timestamp: ult.timestamp,
                value: infoMeUltimateCooldown(ult.value),
            });
        });
        return ultimateCooldown;
    }

    private generatePlayerInUse(): Timestamp<string>[] {
        return (
            this.playerInUseHistory?.map((inUse) => ({
                timestamp: inUse.timestamp,
                value: infoMeInUse(inUse.value.inUse),
            })) ?? []
        );
    }

    private generatePlayerWeapons(): Timestamp<string>[] {
        return (
            this.playerWeaponHistory?.map((weap) => ({
                timestamp: weap.timestamp,
                value: infoMeWeapons(weap.value.weapon0, weap.value.weapon1),
            })) ?? []
        );
    }

    private generateKillFeed(): Timestamp<string>[] {
        return (
            this.killfeedHistory?.map((kf) => ({
                timestamp: kf.timestamp,
                value: eventKillFeed(
                    kf.value.local_player_name,
                    kf.value.attackerName,
                    kf.value.victimName,
                    kf.value.weaponName,
                    kf.value.action
                ),
            })) ?? []
        );
    }

    private generateDamageEvents(): Timestamp<string>[] {
        const events: Timestamp<string>[] = [];
        let damageDealt = 0;
        this.damageEventHistory?.forEach((dmg) => {
            events.push({
                timestamp: dmg.timestamp,
                value: eventDamage(dmg.value.targetName, dmg.value.damageAmount, dmg.value.armor, dmg.value.headshot),
            });
            damageDealt += dmg.value.damageAmount;
            events.push({ timestamp: dmg.timestamp, value: infoMeTotalDamageDealt(damageDealt) });
        });
        return events;
    }

    private generateKnockdownEvents(): Timestamp<string>[] {
        const events: Timestamp<string>[] = [];
        this.knockdownEventHistory?.forEach((kd) => {
            events.push({ timestamp: kd.timestamp, value: eventKnockdown(kd.value.victimName) });
            events.push({
                timestamp: kd.timestamp,
                value: eventKillFeed(
                    this.myName ?? "",
                    this.myName ?? "",
                    kd.value.victimName,
                    this.playerWeaponHistory?.[0].value.weapon0 ?? "",
                    "knockdown"
                ),
            });
        });
        return events;
    }

    private generateKillEvents(): Timestamp<string>[] {
        const events: Timestamp<string>[] = [];
        this.killEventHistory?.forEach((kill) => {
            events.push({ timestamp: kill.timestamp, value: eventKill(kill.value.victimName) });
            events.push({
                timestamp: kill.timestamp,
                value: eventKillFeed(
                    this.myName ?? "",
                    this.myName ?? "",
                    kill.value.victimName,
                    this.playerWeaponHistory?.[0].value.weapon0 ?? "",
                    "knockdown"
                ),
            });
        });
        return events;
    }

    private generatePlayerEvents(): Timestamp<string>[] {
        const events: Timestamp<string>[] = [];
        this.playerRespawnEventHistory?.forEach((event) => {
            events.push({ timestamp: event.timestamp, value: eventPlayerRespawn() });
        });
        this.playerKnockedDownEventHistory?.forEach((event) => {
            events.push({ timestamp: event.timestamp, value: eventPlayerKnockedDown() });
        });
        this.playerHealedFromKOEventHistory?.forEach((event) => {
            events.push({ timestamp: event.timestamp, value: eventPlayerHealedFromKO() });
        });
        this.playerDeathEventHistory?.forEach((event) => {
            events.push({ timestamp: event.timestamp, value: eventPlayerDeath() });
        });
        return events;
    }

    private generateMatchEnd(endDate: Date): Timestamp<string>[] {
        const matchEnd: Timestamp<string>[] = [];
        matchEnd.push({ timestamp: addMilliseconds(endDate, 1), value: eventMatchEnd() });
        matchEnd.push({ timestamp: addMilliseconds(endDate, 1), value: infoGameInfoMatchState("inactive") });
        matchEnd.push({ timestamp: addMilliseconds(endDate, 10), value: infoMeTotalDamageDealt(0) });
        matchEnd.push({ timestamp: addMilliseconds(endDate, 10), value: eventMatchStart() });
        matchEnd.push({ timestamp: addMilliseconds(endDate, 100), value: infoMatchInfoVictory() });
        matchEnd.push({ timestamp: addMilliseconds(endDate, 100), value: infoMeInUse("null") });
        matchEnd.push({ timestamp: addMilliseconds(endDate, 100), value: infoMatchInfoTabs() });
        return matchEnd;
    }

    /** Converts each game log from a JSON encoded String, to a JSON object */
    private parseGameLogs(
        gameLogsStr: Timestamp<string>[]
    ): Timestamp<overwolf.games.events.InfoUpdates2Event | overwolf.games.events.GameEvent>[] {
        return gameLogsStr.map(({ timestamp, value }) => {
            const onErr = (input: string) => {
                throw new Error(`Game Scenario was unable to parse JSON (timestamp "${timestamp}"):\n "${input}"`);
            };
            const decodedGameLog = JSONTryParse(value, onErr) as overwolf.games.events.InfoUpdates2Event | overwolf.games.events.GameEvent;

            if (!decodedGameLog) return;
            return { timestamp, value: decodedGameLog };
        }) as Timestamp<overwolf.games.events.InfoUpdates2Event | overwolf.games.events.GameEvent>[];
    }

    private runGameLoop(gameLogs: Timestamp<overwolf.games.events.InfoUpdates2Event | overwolf.games.events.GameEvent>[]): void {
        if (!this.mockOverwolfAPI) throw Error(`Game Scenario does not have Overwolf API provided`);
        if (!this.mockOverwolfAPI.isInstalled) throw Error(`Game Scenario does not have an installed Mock Overwolf API`);
        const firstTimestamp = gameLogs[0].timestamp;
        gameLogs.forEach(({ timestamp, value }) => {
            const startTimeDiff = differenceInMilliseconds(timestamp, firstTimestamp);
            let owPath = "";
            if (isInfoUpdates2Event(value)) owPath = "overwolf.games.events.onInfoUpdates2";
            else if (isGameEvent(value)) owPath = "overwolf.games.events.onNewEvents";
            else {
                throw Error(`Game Scenario was not provided with a Game Event, nor an Info Event`);
            }

            setTimeout(() => {
                // this.mockOverwolfAPI.triggerMethod(owPath, value);
            }, startTimeDiff);
        });
    }

    /** Verifies that the duration is not too large or throws error */
    private validateTimestamps(gameLogs: Timestamp<overwolf.games.events.InfoUpdates2Event | overwolf.games.events.GameEvent>[]): void {
        const sortedGameLogs = gameLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        const firstGameLog = sortedGameLogs[0];
        const lastGameLog = sortedGameLogs[sortedGameLogs.length - 1];
        const duration = Math.abs(differenceInMilliseconds(lastGameLog.timestamp, firstGameLog.timestamp));
        if (duration > MAX_DURATION) {
            throw new Error(
                `Game Scenario received game data with timestamps larger ` +
                    `than the maximum ${MAX_DURATION / 60 / 1000} minutes: ${duration / 60 / 1000} minutes\n` +
                    `First item: ${JSON.stringify(firstGameLog)}\n` +
                    `Last item: ${JSON.stringify(lastGameLog)}`
            );
        }
    }
}

function isInfoUpdates2Event(value: unknown): value is overwolf.games.events.InfoUpdates2Event {
    type Info = overwolf.games.events.InfoUpdates2Event;
    if (typeof value !== "object") return false;
    if (typeof (value as Info).info !== "object") return false;
    if (typeof (value as Info).feature !== "string") return false;
    return true;
}

function isGameEvent(value: unknown): value is overwolf.games.events.GameEvent {
    type GameEvent = overwolf.games.events.GameEvent;
    if (typeof value !== "object") return false;
    if (typeof (value as GameEvent).data !== "object" && typeof (value as GameEvent).data !== "string") return false;
    if (typeof (value as GameEvent).name !== "string") return false;
    return true;
}
