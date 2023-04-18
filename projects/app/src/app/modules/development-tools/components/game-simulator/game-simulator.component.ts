import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { MatchRosterPlayer } from "@app/app/common/match/roster-player";
import { WINDOW } from "@app/app/modules/core/global-window.provider";
import { MatchRosterService } from "@app/app/modules/core/match/match-roster.service";
import { OWGameEvent } from "@app/app/modules/core/overwolf";
import { ExposedOverwolfGameDataService } from "@app/app/modules/core/overwolf-exposed-data.service";
import { PlayerService } from "@app/app/modules/core/player.service";
import { JSONTryParse } from "common/utilities/";
import { differenceInMilliseconds, format, isDate } from "date-fns";
import { Subject } from "rxjs";
import { basicInventoryQuick } from "./simulations/basic-inventory";
import { resetToInGame } from "./simulations/reset-to-in-game";
import { resetToLobby } from "./simulations/reset-to-lobby";
import { s16BattleRoyale } from "./simulations/s16-battle-royale";
import { s16SoloTrios } from "./simulations/s16-solo-trios";

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
    public fullGameForm = new UntypedFormGroup({
        speedAdjust: new UntypedFormControl(1),
    });
    public get speedAdjust(): number | undefined {
        return this.fullGameForm.get("speedAdjust")?.value;
    }
    public rosterActionsForm = new UntypedFormGroup({
        playerSelected: new UntypedFormControl(),
        damageAmount: new UntypedFormControl(20),
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

    public onPerformBasicInventoryGameClick(speedAdjust?: number): void {
        const commands = this.logToCommands(basicInventoryQuick());
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

    public onPerformS16BattleRoyaleClick(speedAdjust?: number): void {
        const commands = this.logToCommands(s16BattleRoyale());
        this.runCommands(commands, speedAdjust);
    }

    public onPerformS16SoloTriosClick(speedAdjust?: number): void {
        const commands = this.logToCommands(s16SoloTrios());
        this.runCommands(commands, speedAdjust);
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
