import { MockOverwolfAPI } from "@shared-app/mocks/mock-overwolf-api";
import { unique } from "common/utilities/primitives/array";
import { addMilliseconds, addMinutes, subMilliseconds } from "date-fns";
import seedrandom from "seedrandom";
import { NIL, v5 as uuid } from "uuid";
import { GameScenario } from "./game-scenario";

type Timestamp<T> = { timestamp: Date; value: T };

interface GameScenarioBuilderSetup {
    scenarioName: string;
    matchId?: string;
    startDate?: Date;
    endDate?: Date;
    myName?: string;
    myTeamId?: number;
    myTeamSize?: number;
    myTeammates?: overwolf.gep.ApexLegends.MatchInfoRoster[];
    myTeamLegends?: overwolf.gep.ApexLegends.MatchInfoLegendSelect[];
    gameMode?: string;
    rosterSize?: number;
    rosterTeamSize?: number;
    roster?: overwolf.gep.ApexLegends.MatchInfoRoster[];
    timeMsInLobby?: number;
    timeMsInLegendSelect?: number;
    timeMsInDropShip?: number;
    timeMsDropping?: number;
    ultimateCooldownTimeMs?: number;
}

export class GameScenarioBuilder implements GameScenarioBuilderSetup {
    public scenarioName!: string;
    public matchId!: string;
    public startDate!: Date;
    public endDate!: Date;
    public myName!: string;
    public myTeamId!: number;
    public myTeamSize!: number;
    public myTeammates!: overwolf.gep.ApexLegends.MatchInfoRoster[];
    public myTeamLegends!: overwolf.gep.ApexLegends.MatchInfoLegendSelect[];
    public gameMode!: string;
    public rosterSize!: number;
    public rosterTeamSize!: number;
    public roster!: overwolf.gep.ApexLegends.MatchInfoRoster[];
    public timeMsInLobby!: number;
    public timeMsInLegendSelect!: number;
    public timeMsInDropShip!: number;
    public timeMsDropping!: number;
    public ultimateCooldownTimeMs!: number;

    private mockOverwolfAPI!: MockOverwolfAPI;

    private get matchLengthMs(): number {
        return this.endDate.getTime() - this.startDate.getTime();
    }

    private get numTeams(): number {
        return unique(this.roster, (r) => r.team_id).length;
    }

    private lastPlayerCoordinates?: overwolf.gep.ApexLegends.MatchInfoLocation;

    /**
     * Creates and installs a default MockOverwolfAPI if none is provided
     */
    public setup(setup: GameScenarioBuilderSetup, mockOverwolfAPI?: MockOverwolfAPI): this {
        this.scenarioName = setup.scenarioName;
        this.matchId = setup.matchId ?? uuid(this.scenarioName, NIL);
        this.startDate = setup?.startDate ?? this.startDate;
        this.endDate = setup?.endDate ?? addMinutes(this.startDate, 20);
        this.myName = setup?.myName ?? "AllFather";
        this.myTeamId = setup?.myTeamId ?? 0;
        this.myTeamSize = setup?.myTeamSize ?? 3;
        this.myTeammates = this.createTeammates(this.myTeamId, setup?.myTeammates);
        this.myTeamLegends = this.createTeamLegends(this.myTeammates, setup?.myTeamLegends);
        this.gameMode = setup?.gameMode ?? "#PL_TRIO";
        this.rosterSize = setup?.rosterSize ?? 60;
        this.rosterTeamSize = setup?.rosterTeamSize ?? 3;
        this.roster = this.createRoster(setup?.roster);
        this.timeMsInLobby = setup?.timeMsInLobby ?? 20000;
        this.timeMsInLegendSelect = setup?.timeMsInLegendSelect ?? 20000;
        this.timeMsInDropShip = setup?.timeMsInDropShip ?? 20000;
        this.timeMsDropping = setup?.timeMsDropping ?? 20000;
        this.ultimateCooldownTimeMs = setup?.ultimateCooldownTimeMs ?? 2 * 60 * 1000;
        this.mockOverwolfAPI = mockOverwolfAPI ?? new MockOverwolfAPI(true);
        return this;
    }

    public buildGameScenario(): GameScenario {
        const lobbyStartDate = subMilliseconds(this.startDate, this.timeMsInLobby);
        const legendSelectStartDate = subMilliseconds(this.startDate, this.timeMsInLegendSelect);
        const preGameStartDate = subMilliseconds(legendSelectStartDate, this.timeMsInLegendSelect);
        const dropshipStartDate = this.startDate;
        const droppingStartDate = addMilliseconds(dropshipStartDate, this.timeMsInDropShip);
        const inGameStartDate = addMilliseconds(droppingStartDate, this.timeMsDropping);

        return new GameScenario(
            this.scenarioName,
            {
                matchId: this.matchId,
                myName: this.myName,
                matchStartDate: this.startDate,
                lobbyStartDate: lobbyStartDate,
                legendSelectStartDate: legendSelectStartDate,
                preGameStartDate: preGameStartDate,
                matchEndDate: this.endDate,
                gameMode: this.gameMode,
                legendSelects: this.myTeamLegends,
                teammates: this.myTeammates,
                roster: this.roster,
                killfeedHistory: this.createKillfeed(),
                locationHistory: [
                    ...this.createLocationDropship(dropshipStartDate),
                    ...this.createLocationDropping(droppingStartDate),
                    ...this.createLocationInGame(inGameStartDate),
                ],
                ultimateCooldownHistory: this.createUltimateCooldownHistory(this.startDate, this.endDate, this.ultimateCooldownTimeMs),
            },
            this.mockOverwolfAPI
        );
    }

    private createRoster(existing: overwolf.gep.ApexLegends.MatchInfoRoster[] = []): overwolf.gep.ApexLegends.MatchInfoRoster[] {
        const newRoster: overwolf.gep.ApexLegends.MatchInfoRoster[] = [];
        for (let i = 0; i < this.rosterSize; i++) {
            const currentTeamId = Math.floor(i / this.rosterTeamSize);
            if (existing?.[i] != null) {
                newRoster.push(existing[i]);
            } else if (this.myTeammates[i]?.team_id === currentTeamId) {
                newRoster.push(this.myTeammates[i]);
            } else {
                newRoster.push({
                    name: `Player_${i}`,
                    isTeammate: currentTeamId === this.myTeamId,
                    team_id: currentTeamId,
                    platform_hw: 2,
                    platform_sw: 2,
                });
            }
        }
        return newRoster;
    }

    private createTeammates(
        teamId: number,
        existing: overwolf.gep.ApexLegends.MatchInfoRoster[] = []
    ): overwolf.gep.ApexLegends.MatchInfoRoster[] {
        const newTeammates: overwolf.gep.ApexLegends.MatchInfoRoster[] = [];
        for (let i = 0; i < this.myTeamSize; i++) {
            if (existing?.[i] != null) {
                newTeammates.push(existing[i]);
            } else {
                newTeammates.push({
                    name: `Player_${i}`,
                    isTeammate: true,
                    team_id: teamId,
                    platform_hw: 2,
                    platform_sw: 2,
                });
            }
        }
        newTeammates[0].name = this.myName;
        return newTeammates;
    }

    private createTeamLegends(
        teammates: overwolf.gep.ApexLegends.MatchInfoRoster[] = [],
        existing: overwolf.gep.ApexLegends.MatchInfoLegendSelect[] = []
    ): overwolf.gep.ApexLegends.MatchInfoLegendSelect[] {
        const legendList: string[] = [
            "#character_bloodhound_NAME",
            "#character_gibraltar_NAME",
            "#character_lifeline_NAME",
            "#character_pathfinder_NAME",
            "#character_wraith_NAME",
            "#character_bangalore_NAME",
        ];
        const newTeamLegends: overwolf.gep.ApexLegends.MatchInfoLegendSelect[] = [];
        for (let i = 0; i < teammates.length; i++) {
            if (existing?.[i] != null) {
                newTeamLegends.push(existing[i]);
            } else {
                const isLast = i === teammates.length - 1;
                newTeamLegends.push({ playerName: `Player_${i}`, legendName: legendList[i], selectionOrder: i, lead: isLast });
            }
        }
        if (newTeamLegends[0]) newTeamLegends[0].playerName = this.myName;
        return newTeamLegends;
    }

    /**
     * Start from the top of the roster; each team will kill the team below it.
     */
    private createKillfeed(): Timestamp<overwolf.gep.ApexLegends.GameEventKillFeed>[] {
        const newKillfeed: Timestamp<overwolf.gep.ApexLegends.GameEventKillFeed>[] = [];
        const delay = this.matchLengthMs / this.roster.length;
        const teamSize = this.rosterTeamSize;
        const lastIndex = this.roster.length - 1;
        for (let index = 0; index < lastIndex; index++) {
            const attackerIndex = index;
            const victimIndex = attackerIndex + teamSize;
            if (victimIndex === this.myTeamId || attackerIndex === this.myTeamId) continue;
            if (victimIndex > lastIndex) continue;
            const interactionDate = addMilliseconds(this.startDate, index * delay);
            const baseEvent = {
                local_player_name: this.myName,
                attackerName: this.roster[attackerIndex]?.name ?? "",
                victimName: this.roster[victimIndex]?.name ?? "",
                weaponName: "",
            };
            newKillfeed.push({ timestamp: addMilliseconds(interactionDate, 1000), value: { ...baseEvent, action: "knockdown" } });
            newKillfeed.push({ timestamp: addMilliseconds(interactionDate, 5000), value: { ...baseEvent, action: "kill" } });
        }

        return newKillfeed;
    }

    private createLocationDropship(
        initialDate = this.startDate,
        durationMs = 10000
    ): Timestamp<overwolf.gep.ApexLegends.MatchInfoLocation>[] {
        const locationDropship: Timestamp<overwolf.gep.ApexLegends.MatchInfoLocation>[] = [];
        const numLocationEvents = durationMs / 1000;
        const xRate = (seedrandom(this.matchId)() - 0.5) * 10;
        const yRate = (seedrandom(this.scenarioName)() - 0.5) * 10;
        let xPos = xRate < 0 ? 500 : -500;
        let yPos = yRate < 0 ? 500 : -500;
        const zPos = 234;

        for (let i = 0; i < numLocationEvents; i++) {
            xPos += xRate;
            yPos += yRate;

            locationDropship.push({
                timestamp: addMilliseconds(initialDate, i * 1000),
                value: { x: Math.round(xPos), y: Math.round(yPos), z: Math.round(zPos) },
            });
            this.lastPlayerCoordinates = { x: xPos, y: yPos, z: zPos };
        }
        return locationDropship;
    }

    private createLocationDropping(
        initialDate = this.startDate,
        durationMs = 10000
    ): Timestamp<overwolf.gep.ApexLegends.MatchInfoLocation>[] {
        const locationDropping: Timestamp<overwolf.gep.ApexLegends.MatchInfoLocation>[] = [];
        const numLocationEvents = durationMs / 1000;
        const xRate = (seedrandom(this.scenarioName)() - 0.5) * 10;
        const yRate = (seedrandom(this.matchId)() - 0.5) * 10;
        const zRate = -10;
        let xPos = this.lastPlayerCoordinates?.x ?? 0;
        let yPos = this.lastPlayerCoordinates?.y ?? 0;
        let zPos = this.lastPlayerCoordinates?.z ?? 0;

        for (let i = 0; i < numLocationEvents; i++) {
            xPos += xRate;
            yPos += yRate;
            zPos += zRate;

            locationDropping.push({
                timestamp: addMilliseconds(initialDate, i * 1000),
                value: { x: Math.round(xPos), y: Math.round(yPos), z: Math.round(zPos) },
            });
            this.lastPlayerCoordinates = { x: xPos, y: yPos, z: zPos };
        }
        return locationDropping;
    }

    private createLocationInGame(
        initialDate = this.startDate,
        durationMs = 20 * 60 * 1000
    ): Timestamp<overwolf.gep.ApexLegends.MatchInfoLocation>[] {
        const locationInGame: Timestamp<overwolf.gep.ApexLegends.MatchInfoLocation>[] = [];
        const numLocationEvents = durationMs / 1000;
        const rate = 1 / 1000;
        const distance = 90;

        for (let i = 0; i < numLocationEvents; i++) {
            const t = Math.tan(i * Math.PI * rate);
            const xPos = 0 + (distance * (1 - t * t)) / (1 + 1 * t);
            const yPos = 0 + (distance * 2 * t) / (1 + t * t);

            locationInGame.push({
                timestamp: addMilliseconds(initialDate, i * 1000),
                value: { x: Math.round(xPos), y: Math.round(yPos), z: 0 },
            });
            this.lastPlayerCoordinates = { x: xPos, y: yPos, z: 0 };
        }
        return locationInGame;
    }

    private createUltimateCooldownHistory(
        initialDate = this.startDate,
        endDate = this.startDate,
        cooldownDurationMs = 2 * 60 * 1000
    ): Timestamp<number>[] {
        const increaseRate = cooldownDurationMs / 100;
        const ultimateCooldownEvents: Timestamp<number>[] = [];
        let iteration = initialDate.getTime();
        const endIteration = endDate.getTime();

        let ultValue = 0;
        if (iteration >= endIteration || endIteration - iteration > 3600000) {
            console.warn(`Game Scenario Builder did not create ultimate cooldown history. Start: ${iteration}, End: ${endIteration}`);
            return [];
        }
        while (iteration < endIteration) {
            ultValue = ultValue > 100 ? 0 : ultValue + 5;
            ultimateCooldownEvents.push({ timestamp: new Date(iteration), value: ultValue });
            iteration += increaseRate;
        }
        return ultimateCooldownEvents;
    }
}
