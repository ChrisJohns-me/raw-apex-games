import { ChangeDetectionStrategy, Component } from "@angular/core";
import { OverwolfExposedDataService } from "@core/overwolf-exposed-data.service";
import { differenceInMilliseconds, format, isDate } from "date-fns";
import { JSONTryParse } from "src/utilities";

@Component({
    selector: "app-game-simulator",
    templateUrl: "./game-simulator.component.html",
    styleUrls: ["./game-simulator.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameSimulatorComponent {
    constructor(private readonly overwolfExposedData: OverwolfExposedDataService) {}

    public onCustomInjectClick(): void {
        interface Command {
            timestamp: Date;
            command: any;
        }
        let speed = 1;
        const inputInject = prompt(`Inject Log`, "");
        const inputInjectArr = inputInject?.trim().split("\n");

        if (!inputInjectArr || !Array.isArray(inputInjectArr) || !inputInjectArr.length) {
            console.error("Unexpected data.", inputInject, inputInjectArr);
            return;
        }

        const speedInput = prompt("Replay Speed (1=realtime, empty=full speed)", "1");
        speed = parseFloat(speedInput ?? String(speed));

        const matchRegEx = /^\[(.+?)\] (.*)$/m;

        // Gather the commands
        const commands: Command[] = inputInjectArr
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
        const firstTimestamp = commands[0].timestamp;
        const timestampDiff = Math.abs(differenceInMilliseconds(commands[commands.length - 1].timestamp, firstTimestamp));
        const warnInMins = 30;
        if (timestampDiff > warnInMins * 60 * 1000) {
            // Alert if there's a large gap
            if (!confirm(`Data has a time gap of ${format(timestampDiff, "dd 'days' hh 'hours' mm 'mins")} Continue?`)) {
                return;
            }
        }

        // Run the commands
        commands.forEach((cmd) => {
            if (!cmd) return;
            const commandFn =
                cmd.command?.feature != null
                    ? this.overwolfExposedData.injectOnInfoUpdates2
                    : this.overwolfExposedData.injectOnNewGameEvents;

            const startTimeDiff = differenceInMilliseconds(cmd.timestamp, firstTimestamp);
            setTimeout(() => commandFn.bind(this.overwolfExposedData)(cmd.command), startTimeDiff / speed);
        });
    }
}
