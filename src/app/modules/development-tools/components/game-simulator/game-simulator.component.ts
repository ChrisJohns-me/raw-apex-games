import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatchRosterPlayer } from "@common/match/match-roster-player";
import { MatchRosterService } from "@core/match/match-roster.service";
import { OverwolfExposedDataService } from "@core/overwolf-exposed-data.service";
import { PlayerService } from "@core/player.service";
import { differenceInMilliseconds, format, isDate } from "date-fns";
import { Subject } from "rxjs";
import { JSONTryParse } from "src/utilities";
import { resetToInGame } from "./simulations/reset-to-in-game";
import { resetToLobby } from "./simulations/reset-to-lobby";

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
export class GameSimulatorComponent implements OnInit, OnDestroy {
    public latestCommand?: Command;

    public rosterActionsForm = new FormGroup({
        playerSelected: new FormControl(),
    });

    public get rosterPlayerSelected(): MatchRosterPlayer | undefined {
        return this.rosterActionsForm.get("playerSelected")?.value;
    }

    private _unsubscribe$ = new Subject<void>();

    constructor(
        private cdr: ChangeDetectorRef,
        private readonly overwolfExposedData: OverwolfExposedDataService,
        private readonly player: PlayerService,
        public readonly matchRoster: MatchRosterService
    ) {}

    public ngOnInit(): void {
        // ...
    }

    public ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    public onResetToInGameClick(): void {
        const commands = this.logToCommands(resetToInGame);
        this.runCommands(commands);
    }

    public onResetToLobbyClick(): void {
        const commands = this.logToCommands(resetToLobby);
        this.runCommands(commands);
    }

    public onKillfeedKnockeddownClick(player?: MatchRosterPlayer): void {
        if (!player) return;
    }

    public onKillfeedEliminatedClick(player?: MatchRosterPlayer): void {
        if (!player) return;
    }

    public onInflictDamageClick(player?: MatchRosterPlayer): void {
        if (!player) return;
        const event: overwolf.games.events.GameEvent = {
            name: "damage",
            data: `{
                "targetName": "${player.name}",
                "damageAmount": "${String(Math.random() * 50)}",
                "armor": "${Math.random() < 0.5 ? true : false}",
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

        const event: overwolf.games.events.GameEvent = {
            name: "knockdown",
            data: `{ "victimName": "${player.name}" }`,
        };
        const killfeedEvent: overwolf.games.events.GameEvent = {
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
        const event: overwolf.games.events.GameEvent = {
            name: "kill",
            data: `{ "victimName": "${player.name}" }`,
        };
        const killfeedEvent: overwolf.games.events.GameEvent = {
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
        const injectInput = prompt(`Inject Log`, "");
        const speedInput = prompt("Replay Speed (1=realtime, empty=full speed)", "1");
        speed = parseFloat(speedInput ?? String(speed));

        const commands = this.logToCommands(injectInput ?? "");
        const firstTimestamp = commands[0]?.timestamp;
        const timestampDiff = Math.abs(differenceInMilliseconds(commands[commands.length - 1].timestamp, firstTimestamp));
        const warnInMins = 30;
        if (timestampDiff > warnInMins * 60 * 1000) {
            // Alert if there's a large gap
            if (!confirm(`Data has a time gap of ${format(timestampDiff, "dd 'days' hh 'hours' mm 'mins")} Continue?`)) {
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
                    ? this.overwolfExposedData.injectOnInfoUpdates2
                    : this.overwolfExposedData.injectOnNewGameEvents;

            const startTimeDiff = differenceInMilliseconds(cmd.timestamp, firstTimestamp);
            setTimeout(() => {
                commandFn.bind(this.overwolfExposedData)(cmd.command);
                this.latestCommand = cmd;
                this.cdr.detectChanges();
            }, startTimeDiff / speedAdjust);
        });
    }
}
