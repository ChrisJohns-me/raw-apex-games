import { MatchRosterPlayer } from "@allfather-app/app/common/match/roster-player";
import { WINDOW } from "@allfather-app/app/modules/core/global-window.provider";
import { MatchRosterService } from "@allfather-app/app/modules/core/match/match-roster.service";
import { OWGameEvent } from "@allfather-app/app/modules/core/overwolf";
import { ExposedOverwolfGameDataService } from "@allfather-app/app/modules/core/overwolf-exposed-data.service";
import { PlayerService } from "@allfather-app/app/modules/core/player.service";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { JSONTryParse } from "common/utilities/";
import { differenceInMilliseconds, format, isDate } from "date-fns";
import { Subject } from "rxjs";
import { almost1 } from "./simulations/almost1";
import { arenaModeSuddenDeath } from "./simulations/arena-mode-sudden-death";
import { basicInventoryQuick } from "./simulations/basic-inventory";
import { fullGame1Eventful } from "./simulations/full-game1-eventful";
import { fullGame1Quick } from "./simulations/full-game1-quick";
import { fullGame2_2k } from "./simulations/full-game2-2k";
import { inflictionInsightBroke } from "./simulations/infliction-insight-break";
import { legendSelectEvents } from "./simulations/legend-select-events";
import { resetToInGame } from "./simulations/reset-to-in-game";
import { resetToLobby } from "./simulations/reset-to-lobby";
import { s12Control } from "./simulations/s12-control";
import { s12Flashpoint } from "./simulations/s12-flashpoint";
import { s12Quick } from "./simulations/s12-quick";
import { s13GameBroke } from "./simulations/s13-game-broke";
import { stupidGame1Full } from "./simulations/stupid-game1";
import { valkUltGame } from "./simulations/valk-ult-game";

interface Command {
    timestamp: Date;
    command: any;
}

@Component({
    selector: "app-game-simulator",
    templateUrl: "./game-simulator.component.html",
    styleUrls: ["./game-simulator.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameSimulatorComponent implements OnDestroy {
    public latestCommand?: Command;
    public fullGameForm = new FormGroup({
        speedAdjust: new FormControl(1),
    });
    public get speedAdjust(): number | undefined {
        return this.fullGameForm.get("speedAdjust")?.value;
    }
    public rosterActionsForm = new FormGroup({
        playerSelected: new FormControl(),
        damageAmount: new FormControl(20),
    });
    public get rosterPlayerSelected(): MatchRosterPlayer | undefined {
        return this.rosterActionsForm.get("playerSelected")?.value;
    }
    public get damageAmount(): number | undefined {
        return this.rosterActionsForm.get("damageAmount")?.value;
    }

    private destroy$ = new Subject<void>();

    constructor(
        private cdr: ChangeDetectorRef,
        private readonly exposedOverwolfData: ExposedOverwolfGameDataService,
        private readonly player: PlayerService,
        public readonly matchRoster: MatchRosterService,
        @Inject(WINDOW) private readonly window: Window
    ) {}

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onPerformArenaModeSuddenDeathClick(speedAdjust?: number): void {
        const commands = this.logToCommands(arenaModeSuddenDeath());
        this.runCommands(commands, speedAdjust);
    }

    public onPerformArenasModeClick(speedAdjust?: number): void {
        // const commands = this.logToCommands(arenaMode());
        // this.runCommands(commands, speedAdjust);
    }

    public onPerformAlmost1GameClick(speedAdjust?: number): void {
        const commands = this.logToCommands(almost1());
        this.runCommands(commands, speedAdjust);
    }

    public onPerformFullQuickGameClick(): void {
        const commands = this.logToCommands(fullGame1Quick());
        this.runCommands(commands);
    }

    public onPerformStupidGame1FullGameClick(speedAdjust?: number): void {
        const commands = this.logToCommands(stupidGame1Full());
        this.runCommands(commands, speedAdjust);
    }

    public onPerformFullGame1Click(speedAdjust?: number): void {
        const commands = this.logToCommands(fullGame1Eventful());
        this.runCommands(commands, speedAdjust);
    }

    public onPerformFullGame2Click(speedAdjust?: number): void {
        const commands = this.logToCommands(fullGame2_2k());
        this.runCommands(commands, speedAdjust);
    }

    public onPerformValkUltGameClick(speedAdjust?: number): void {
        const commands = this.logToCommands(valkUltGame());
        this.runCommands(commands, speedAdjust);
    }

    public onPerformS12QuickGameClick(speedAdjust?: number): void {
        const commands = this.logToCommands(s12Quick());
        this.runCommands(commands, speedAdjust);
    }

    public onPerformS12ControlGameClick(speedAdjust?: number): void {
        const commands = this.logToCommands(s12Control());
        this.runCommands(commands, speedAdjust);
    }

    public onPerformS12FlashpointGameClick(speedAdjust?: number): void {
        const commands = this.logToCommands(s12Flashpoint());
        this.runCommands(commands, speedAdjust);
    }

    public onPerformBasicInventoryGameClick(speedAdjust?: number): void {
        const commands = this.logToCommands(basicInventoryQuick());
        this.runCommands(commands, speedAdjust);
    }

    public onPerformInflictionInsightBreakGameClick(speedAdjust?: number): void {
        const commands = this.logToCommands(inflictionInsightBroke());
        this.runCommands(commands, speedAdjust);
    }

    public onPerformLegendSelectGameClick(speedAdjust?: number): void {
        const commands = this.logToCommands(legendSelectEvents());
        this.runCommands(commands, speedAdjust);
    }

    public onPerformS13GameBrokeClick(speedAdjust?: number): void {
        const commands = this.logToCommands(s13GameBroke());
        this.runCommands(commands, speedAdjust);
    }

    public onResetToInGameClick(): void {
        const commands = this.logToCommands(resetToInGame());
        this.runCommands(commands);
    }

    public onResetToLobbyClick(): void {
        const commands = this.logToCommands(resetToLobby());
        this.runCommands(commands);
    }

    public onKillfeedKnockeddownClick(player?: MatchRosterPlayer, randomAttacker = false): void {
        if (!player) return;
        const attackerName = randomAttacker ? this.getRandomPlayer()?.name : this.player.myName$.value;

        const killfeedEvent: OWGameEvent = {
            name: "kill_feed",
            data: `{
                "local_player_name": "${this.player.myName$.value}",
                "attackerName": "${attackerName}",
                "victimName": "${player.name}",
                "weaponName": "energy_ar",
                "action": "knockdown"
            }`,
        };
        const commands: Command[] = [
            {
                timestamp: new Date(0),
                command: killfeedEvent,
            },
        ];

        this.runCommands(commands);
    }

    public onKillfeedEliminatedClick(player?: MatchRosterPlayer, randomAttacker = false): void {
        if (!player) return;
        const attackerName = randomAttacker ? this.getRandomPlayer()?.name : this.player.myName$.value;

        const killfeedEvent: OWGameEvent = {
            name: "kill_feed",
            data: `{
                "local_player_name": "${this.player.myName$.value}",
                "attackerName": "${attackerName}",
                "victimName": "${player.name}",
                "weaponName": "energy_ar",
                "action": "kill"
            }`,
        };
        const commands: Command[] = [
            {
                timestamp: new Date(0),
                command: killfeedEvent,
            },
        ];

        this.runCommands(commands);
    }

    public onInflictDamageClick(player?: MatchRosterPlayer, damageAmount?: number, toShield = true): void {
        if (!player) return;
        const event: OWGameEvent = {
            name: "damage",
            data: `{
                "targetName": "${player.name}",
                "damageAmount": "${damageAmount}",
                "armor": "${toShield}",
                "headshot": "${Math.random() < 0.25 ? true : false}"
            }`,
        };
        const commands: Command[] = [
            {
                timestamp: new Date(0),
                command: event,
            },
        ];

        this.runCommands(commands);
    }

    public onInflictKnockClick(player?: MatchRosterPlayer): void {
        if (!player) return;
        const event: OWGameEvent = {
            name: "knockdown",
            data: `{ "victimName": "${player.name}" }`,
        };
        const killfeedEvent: OWGameEvent = {
            name: "kill_feed",
            data: `{
                "local_player_name": "${this.player.myName$.value}",
                "attackerName": "${this.player.myName$.value}",
                "victimName": "${player.name}",
                "weaponName": "energy_ar",
                "action": "knockdown"
            }`,
        };
        const commands: Command[] = [
            {
                timestamp: new Date(0),
                command: event,
            },
            {
                timestamp: new Date(1),
                command: killfeedEvent,
            },
        ];

        this.runCommands(commands);
    }

    public onInflictEliminateClick(player?: MatchRosterPlayer): void {
        if (!player) return;
        const event: OWGameEvent = {
            name: "kill",
            data: `{ "victimName": "${player.name}" }`,
        };
        const killfeedEvent: OWGameEvent = {
            name: "kill_feed",
            data: `{
                "local_player_name": "${this.player.myName$.value}",
                "attackerName": "${this.player.myName$.value}",
                "victimName": "${player.name}",
                "weaponName": "energy_ar",
                "action": "kill"
            }`,
        };

        const commands: Command[] = [
            {
                timestamp: new Date(0),
                command: event,
            },
            {
                timestamp: new Date(1),
                command: killfeedEvent,
            },
        ];

        this.runCommands(commands);
    }

    public onCustomInjectClick(): void {
        let speed = 1;
        const injectInput = this.window.prompt(`Inject Log`, "");
        const speedInput = this.window.prompt("Replay Speed (1=realtime, empty=full speed)", "1");
        speed = parseFloat(speedInput ?? String(speed));

        const commands = this.logToCommands(injectInput ?? "");
        const firstTimestamp = commands[0]?.timestamp;
        const timestampDiff = Math.abs(differenceInMilliseconds(commands[commands.length - 1].timestamp, firstTimestamp));
        const warnInMins = 30;
        if (timestampDiff > warnInMins * 60 * 1000) {
            // Alert if there's a large gap
            if (!this.window.confirm(`Data has a time gap of ${format(timestampDiff, "dd 'days' hh 'hours' mm 'mins")} Continue?`)) {
                return;
            }
        }

        this.runCommands(commands, speed);
    }

    private logToCommands(input: string): Command[] {
        const inputArr = input?.trim().split("\n");
        const matchRegEx = /^\[(.+?)\] (.*)$/m;

        if (!inputArr || !Array.isArray(inputArr) || !inputArr.length) {
            console.error("Unexpected data.", inputArr);
            return [];
        }

        const commands: Command[] = inputArr
            .map((line) => {
                const timestampMatch = line.match(matchRegEx)?.[1];
                const commandMatch = line.match(matchRegEx)?.[2];
                if (!timestampMatch || !commandMatch) return;
                const command = JSONTryParse(commandMatch);
                if (!isDate(new Date(timestampMatch))) console.warn(`Timestamp could not be extracted from log.`);
                const timestamp = isDate(new Date(timestampMatch)) ? new Date(timestampMatch) : new Date();
                return { timestamp, command };
            })
            .filter((cmd) => !!cmd && !!cmd.command && !!cmd.timestamp) as Command[];

        // Sort by date
        commands.sort((cmdA, cmdB) => cmdA.timestamp.getTime() - cmdB.timestamp.getTime());
        return commands;
    }

    private runCommands(input: Command[], speedAdjust = 1): void {
        const firstTimestamp = input[0].timestamp;
        input.forEach((cmd) => {
            if (!cmd) return;
            const commandFn =
                cmd.command?.feature != null
                    ? this.exposedOverwolfData.injectOnInfoUpdates2
                    : this.exposedOverwolfData.injectOnNewGameEvents;

            const startTimeDiff = differenceInMilliseconds(cmd.timestamp, firstTimestamp);
            setTimeout(() => {
                commandFn.bind(this.exposedOverwolfData)(cmd.command);
                this.latestCommand = cmd;
                this.cdr.detectChanges();
            }, startTimeDiff / speedAdjust);
        });
    }

    private getRandomPlayer(): Optional<MatchRosterPlayer> {
        const players = this.matchRoster.matchRoster$.value.allPlayers;
        if ((players?.length ?? 0) <= 1) return;
        const randomNum = Math.floor(Math.random() * players.length);
        const randomPlayer = players[randomNum];
        if (randomPlayer.isMe) return this.getRandomPlayer();
        return randomPlayer;
    }
}
