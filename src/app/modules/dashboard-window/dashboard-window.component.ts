import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { GameProcessService } from "@core/game-process.service";
import { GameService } from "@core/game.service";
import { GoogleFormsMatchSummaryTrackerService } from "@core/google-forms-match-summary-tracker.service";
import { MatchRosterService } from "@core/match-roster.service";
import { MatchService } from "@core/match.service";
import { OverwolfDataProviderService } from "@core/overwolf-data-provider";
import { OverwolfExposedDataService } from "@core/overwolf-exposed-data.service";
import { PlayerActivityService } from "@core/player-activity.service";
import { PlayerInventoryService } from "@core/player-inventory.service";
import { PlayerLegendService } from "@core/player-legend.service";
import { PlayerLocationService } from "@core/player-location.service";
import { PlayerService } from "@core/player.service";
import { TeammateService } from "@core/teammate.service";
import { differenceInMilliseconds } from "date-fns";
import { merge, Subject } from "rxjs";
import { delay, filter, takeUntil, tap } from "rxjs/operators";
import { JSONTryParse } from "src/utilities";
import { BackgroundService } from "../background/background.service";
import { InGameMatchTimerWindowService } from "../in-game-match-timer-window/in-game-match-timer-window.service";
import { InGameUltimateCountdownWindowService } from "../in-game-ultimate-countdown-window/in-game-ultimate-countdown-window.service";

@Component({
    selector: "app-dashboard-window",
    templateUrl: "./dashboard-window.component.html",
    styleUrls: ["./dashboard-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardWindowComponent implements OnInit, OnDestroy {
    public primaryTitle = "Dashboard";
    public secondaryTitle = "";

    public hasRecentlyTrackedMatchSummary = false;
    public get isTrackingEnabled(): boolean {
        return this.googleFormsMatchSummaryTracker.isTrackingEnabled;
    }
    public set isTrackingEnabled(value: boolean) {
        this.googleFormsMatchSummaryTracker.setTrackingEnabled(value);
    }

    public gameProcessInfoList = "";
    public gameInfoList = "";
    public gameEventList = "";

    private _unsubscribe = new Subject<void>();

    constructor(
        private readonly backgroundService: BackgroundService,
        private readonly cdr: ChangeDetectorRef,
        private readonly googleFormsMatchSummaryTracker: GoogleFormsMatchSummaryTrackerService,
        private readonly inGameUltimateCooldownWindow: InGameUltimateCountdownWindowService,
        private readonly matchTimerWindow: InGameMatchTimerWindowService,
        private readonly overwolfDataProvider: OverwolfDataProviderService,
        private readonly overwolfExposedData: OverwolfExposedDataService,
        public readonly game: GameService,
        public readonly gameProcess: GameProcessService,
        public readonly match: MatchService,
        public readonly matchRoster: MatchRosterService,
        public readonly player: PlayerService,
        public readonly playerActivity: PlayerActivityService,
        public readonly playerInventory: PlayerInventoryService,
        public readonly playerLegend: PlayerLegendService,
        public readonly playerLocation: PlayerLocationService,
        public readonly teammate: TeammateService
    ) {}

    public ngOnInit(): void {
        this.registerGameEvents();
        this.registerBackgroundEvents();
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public onForceRefreshClick(): void {
        this.cdr.detectChanges();
    }

    public onOpenUltimateCountdownClick(): void {
        this.inGameUltimateCooldownWindow.open().pipe(takeUntil(this._unsubscribe)).subscribe();
    }

    public onOpenMatchTimerClick(): void {
        this.matchTimerWindow.open().pipe(takeUntil(this._unsubscribe)).subscribe();
    }

    public onInjectInfoClick(): void {
        // TODO: Doubt these work...
        this.injectOverwolfData("Info", this.overwolfExposedData.injectOnInfoUpdates2);
    }

    public onInjectEventClick(): void {
        // TODO: Doubt these work...
        this.injectOverwolfData("Event", this.overwolfExposedData.injectOnNewGameEvents);
    }

    private injectOverwolfData(name: string, eventFn: (event: any, delay: number) => void): void {
        this.isTrackingEnabled = false;
        interface Command {
            timestamp: Date;
            command: unknown;
        }
        let speed = 1;
        const inputInject = prompt(`Inject ${name} (RAW Log)`, "");
        const inputInjectArr = inputInject?.trim().split("\n");

        if (!inputInjectArr || !Array.isArray(inputInjectArr) || !inputInjectArr.length) {
            console.error("Unexpected data.", inputInject, inputInjectArr);
            return;
        }

        const speedInput = prompt("Replay Speed (1=realtime, empty=full speed)", "1");
        speed = parseInt(speedInput ?? String(speed));

        const matchRegEx = /^\[(.+?)\] (.*)$/m;

        // Gather the commands
        const commands: Command[] = inputInjectArr
            .map((line) => {
                const timestampMatch = line.match(matchRegEx)?.[1];
                const commandMatch = line.match(matchRegEx)?.[2];
                if (!timestampMatch || !commandMatch) return;
                const timestamp = new Date(timestampMatch);
                const command = JSONTryParse(commandMatch);
                return { timestamp, command };
            })
            .filter((cmd) => !!cmd && !!cmd.command && !!cmd.timestamp) as Command[];

        // Sort by date
        commands.sort((cmdA, cmdB) => cmdA.timestamp.getTime() - cmdB.timestamp.getTime());
        const firstTimestamp = commands[0].timestamp;

        // Run the commands
        commands.forEach((cmd) => {
            if (!cmd) return;
            const startTimeDiff = differenceInMilliseconds(cmd.timestamp, firstTimestamp);
            setTimeout(() => eventFn(cmd.command as any, 0), startTimeDiff / speed);
        });
    }

    private registerGameEvents(): void {
        // TODO: Cleanup. Possibly moving stuff into this `merge()`
        merge(
            this.overwolfExposedData.rawGameInfoUpdated$.pipe(
                tap((event) => (this.gameProcessInfoList = createLogItem(event) + this.gameProcessInfoList))
            ),
            this.overwolfExposedData.rawInfoUpdates$.pipe(
                tap((event) => (this.gameInfoList = createLogItem(event) + this.gameInfoList))
            ),
            this.overwolfExposedData.rawNewGameEvent$.pipe(
                tap((event) => (this.gameEventList = createLogItem(event) + this.gameEventList))
            )
            // this.game.phase$,
            // this.gameProcess.isInFocus$,
            // this.gameProcess.isRunning$,
            // this.match.gameMode$,
            // this.match.map$,
            // this.match.state$,
            // this.match.time$,
            // this.matchRoster.teammates$,
            // this.player.playerName$,
            // this.player.status$,
            // this.playerActivity.damageRoster$,
            // this.playerActivity.placement$,
            // this.playerActivity.victory$,
            // this.playerInventory.inUse$,
            // this.playerInventory.inventory$,
            // this.playerInventory.weapons$,
            // this.playerLegend.legend$,
            // this.playerLegend.ultimateCooldownPercent$,
            // this.playerLocation.coordinates$,
            // this.playerLocation.landingCoordinates$,
            // this.playerLocation.locationPhase$,
            // this.playerLocation.startingCoordinates$,
        )
            .pipe(takeUntil(this._unsubscribe))
            .subscribe(() => this.cdr.detectChanges());
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

function createLogItem(input: any): string {
    const now = new Date();
    const eventStr = JSON.stringify(input);
    return `[${now.getTime()}] ${eventStr}\n`;
}
