import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { GamePhase } from "@common/game-phase";
import { GameProcessService } from "@core/game-process.service";
import { GameService } from "@core/game.service";
import { GoogleFormsMatchSummaryTrackerService } from "@core/google-forms-match-summary-tracker.service";
import { MatchMapService } from "@core/match-map.service";
import { MatchPlayerInventoryService } from "@core/match-player-inventory.service";
import { MatchPlayerLegendService } from "@core/match-player-legend.service";
import { MatchPlayerLocationService } from "@core/match-player-location.service";
import { MatchPlayerStatsService } from "@core/match-player-stats.service";
import { MatchPlayerService } from "@core/match-player.service";
import { MatchRosterService } from "@core/match-roster.service";
import { MatchService } from "@core/match.service";
import { OverwolfExposedDataService } from "@core/overwolf-exposed-data.service";
import { PlayerService } from "@core/player.service";
import { differenceInMilliseconds, format, isDate } from "date-fns";
import { merge, Subject } from "rxjs";
import { delay, filter, takeUntil, tap } from "rxjs/operators";
import { JSONTryParse } from "src/utilities";
import { InGameDamageCollectorWindowService } from "../in-game-damage-collector-window/in-game-damage-collector-window.service";
import { InGameMatchTimerWindowService } from "../in-game-match-timer-window/in-game-match-timer-window.service";
import { InGameUltTimerWindowService } from "../in-game-ult-timer-window/in-game-ult-timer-window.service";

@Component({
    selector: "app-dashboard-window",
    templateUrl: "./dashboard-window.component.html",
    styleUrls: ["./dashboard-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardWindowComponent implements OnInit, OnDestroy {
    public Infinity = Infinity;
    public autoClearLog = false;
    public hasRecentlyTrackedMatchSummary = false;
    public get isTrackingEnabled(): boolean {
        return this.googleFormsMatchSummaryTracker.isTrackingEnabled;
    }
    public set isTrackingEnabled(value: boolean) {
        this.googleFormsMatchSummaryTracker.setTrackingEnabled(value);
    }
    public get matchDuration(): Date {
        const startDate = this.match.currentState$.value.startDate ?? new Date();
        const endDate = this.match.currentState$.value.endDate ?? new Date();
        return new Date(endDate.getTime() - startDate.getTime());
    }

    public gameLog = "";
    private gameLogStartTime?: Date;

    private _unsubscribe = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly damageCollectorWindow: InGameDamageCollectorWindowService,
        private readonly googleFormsMatchSummaryTracker: GoogleFormsMatchSummaryTrackerService,
        private readonly inGameUltTimerWindow: InGameUltTimerWindowService,
        private readonly matchTimerWindow: InGameMatchTimerWindowService,
        private readonly overwolfExposedData: OverwolfExposedDataService,
        public readonly game: GameService,
        public readonly gameProcess: GameProcessService,
        public readonly match: MatchService,
        public readonly matchMap: MatchMapService,
        public readonly matchPlayer: MatchPlayerService,
        public readonly matchPlayerInventory: MatchPlayerInventoryService,
        public readonly matchPlayerLegend: MatchPlayerLegendService,
        public readonly matchPlayerLocation: MatchPlayerLocationService,
        public readonly matchPlayerStats: MatchPlayerStatsService,
        public readonly matchRoster: MatchRosterService,
        public readonly player: PlayerService
    ) {}

    public ngOnInit(): void {
        this.registerAutoClearLogs();
        this.registerGameEvents();
        this.registerBackgroundEvents();
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public onOpenUltTimerClick(): void {
        this.inGameUltTimerWindow.open().pipe(takeUntil(this._unsubscribe)).subscribe();
    }

    public onOpenMatchTimerClick(): void {
        this.matchTimerWindow.open().pipe(takeUntil(this._unsubscribe)).subscribe();
    }

    public onOpenDamageCollectorClick(): void {
        this.damageCollectorWindow.open().pipe(takeUntil(this._unsubscribe)).subscribe();
    }

    public onInjectLogClick(): void {
        this.isTrackingEnabled = false;
        interface Command {
            timestamp: Date;
            command: any;
        }
        let speed = 1;
        const inputInject = prompt(`Inject ${name} Log`, "");
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

    public clearLog(): void {
        this.gameLogStartTime = undefined;
        this.gameLog = "";
    }

    private registerAutoClearLogs(): void {
        this.game.phase$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((gamePhase) => gamePhase === GamePhase.Lobby),
                filter(() => this.autoClearLog),
                delay(30000)
            )
            .subscribe(() => this.clearLog());
    }

    private registerGameEvents(): void {
        merge(
            this.overwolfExposedData.rawInfoUpdates$.pipe(tap((event) => this.addLogItem(event) + this.gameLog)),
            this.overwolfExposedData.rawNewGameEvent$.pipe(tap((event) => this.addLogItem(event) + this.gameLog))
        )
            .pipe(takeUntil(this._unsubscribe))
            .subscribe(() => this.cdr.detectChanges());
    }

    private addLogItem(input: any): void {
        if (!this.gameLogStartTime) this.gameLogStartTime = new Date();

        const timestamp = format(new Date(), "yyyy-MM-dd hh:mm:ss.SSS aa");
        const eventStr = JSON.stringify(input);
        this.gameLog = `[${timestamp}] ${eventStr}\n` + this.gameLog;
    }

    private registerBackgroundEvents(): void {
        const showReportedDuration = 120 * 1000;

        const hasTrackedFn = (value: boolean): void => {
            this.hasRecentlyTrackedMatchSummary = value;
            this.cdr.detectChanges();
        };

        this.googleFormsMatchSummaryTracker.lastMatchSummary
            .pipe(
                takeUntil(this._unsubscribe),
                filter((matchSummary) => !!matchSummary && !!matchSummary.legend && (matchSummary.placement ?? 0) > 0),
                tap(() => hasTrackedFn(true)),
                delay(showReportedDuration),
                tap(() => hasTrackedFn(false))
            )
            .subscribe();
    }
}
