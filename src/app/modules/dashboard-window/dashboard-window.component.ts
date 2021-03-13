import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { getFriendlyMapName } from "@common/game-map";
import { getFriendlyGameMode } from "@common/game-mode";
import { getFriendlyLegendName } from "@common/legend";
import { GameEventsService } from "@core/game";
import { differenceInMilliseconds } from "date-fns";
import { Subject } from "rxjs";
import { delay, filter, map, takeUntil, tap } from "rxjs/operators";
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
        return this.backgroundService.isTrackingEnabled;
    }
    public set isTrackingEnabled(value: boolean) {
        this.backgroundService.setTrackingEnabled(value);
    }

    public gameProcessInfoList = "";
    public gameInfoList = "";
    public gameEventList = "";
    public gameStage = "";
    public gameMode = "";
    public gameMapName = "";
    public playerName = "";
    public playerLegend = "";
    public playerLocation = "";
    public playerSquadmates = "";
    public ultimatePercent = 0;

    public get matchDurationDate(): Optional<Date> {
        return this.matchDurationMs ? new Date(this.matchDurationMs) : undefined;
    }
    public matchStartDate?: Date;
    public matchEndDate?: Date;
    public matchDurationMs?: number;

    private _unsubscribe = new Subject<void>();

    constructor(
        private readonly backgroundService: BackgroundService,
        private readonly cdr: ChangeDetectorRef,
        private readonly gameEvents: GameEventsService,
        private readonly inGameUltimateCooldownWindow: InGameUltimateCountdownWindowService,
        private readonly matchTimerWindow: InGameMatchTimerWindowService
    ) {}

    public ngOnInit(): void {
        this.registerGameEvents();
        this.registerBackgroundEvents();
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public onInjectInfoCmdClick(): void {
        this.__injectCmdFn("Info", (...args) => this.gameEvents.__debugInjectGameInfoEvent(...args));
    }

    public onInjectEventCmdClick(): void {
        this.__injectCmdFn("Event", (...args) => this.gameEvents.__debugInjectGameDataEvent(...args));
    }

    public onInjectInfoLogClick(): void {
        this.__injectLogFn("Info", (...args) => this.gameEvents.__debugInjectGameInfoEvent(...args));
    }

    public onInjectEventLogClick(): void {
        this.__injectLogFn("Event", (...args) => this.gameEvents.__debugInjectGameDataEvent(...args));
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

    private __injectCmdFn(name: string, eventFn: (event: any, delayMs: number) => void): void {
        this.isTrackingEnabled = false;

        let delayMs = 250;
        const inputInject = prompt(`Inject ${name} (JSON)`, "");
        const inputInjectParsed = JSONTryParse(inputInject ?? "");

        if (!inputInjectParsed) {
            console.error("Unexpected data.", inputInject, inputInjectParsed);
            return;
        }

        if (Array.isArray(inputInjectParsed)) {
            const inputDelayMs = prompt("Delay (milliseconds)", String(delayMs));
            delayMs = parseInt(inputDelayMs ?? String(delayMs));
        }

        eventFn(inputInjectParsed, delayMs);
    }

    private __injectLogFn(name: string, eventFn: (event: Record<string, any>, delay: number) => void): void {
        this.isTrackingEnabled = false;
        interface Command {
            timestamp: Date;
            command: unknown;
        }
        let speed = 1;
        const inputInject = prompt(`Inject ${name} (RAW Log)`, "");
        const inputInjectArr = inputInject?.split("\n");

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
        // merge(
        //     this.gameEvents.gameProcessUpdate$,
        //     this.gameEvents.gameInfo$,
        //     this.gameEvents.gameEvent$,
        //     this.gameEvents.gameStage$,
        //     this.gameEvents.gameMode$,
        //     this.gameEvents.gameMapName$,
        //     this.gameEvents.gameMatchTime$,
        //     this.gameEvents.playerName$,
        //     this.gameEvents.playerLegend$,
        //     this.gameEvents.playerInGameLocation$,
        //     this.gameEvents.playerSquadmates$,
        // ).pipe(
        //     takeUntil(this._unsubscribe),
        //     tap((event) => (this.gameProcessInfoList = createLogItem(event) + this.gameProcessInfoList)),
        //     tap((event) => (this.gameInfoList = createLogItem(event) + this.gameInfoList)),
        //     tap((event) => (this.gameEventList = createLogItem(event) + this.gameEventList)),
        //     tap((stage) => (this.gameStage = stage)),
        //     tap((event) => (this.gameMode = event)),
        //     tap((mapName) => (this.gameMapName = mapName)),
        //     tap((matchTime) => (this.matchStartDate = matchTime.start)),,
        //     tap((matchTime) => (this.matchEndDate = matchTime.end)),,
        //     tap((matchTime) => (this.matchDurationMs = matchTime.durationMs)),
        //     tap((event) => (this.playerName = event)),
        //     tap((event) => (this.playerLegend = event)),
        //     tap((event) => (this.playerLocation = JSON.stringify(event))),
        // ).subscribe(() => this.cdr.detectChanges());

        // Game Process Updates
        this.gameEvents.gameProcessUpdate$
            .pipe(
                takeUntil(this._unsubscribe),
                tap((event) => (this.gameProcessInfoList = createLogItem(event) + this.gameProcessInfoList))
            )
            .subscribe(() => this.cdr.detectChanges());

        // Game Info
        this.gameEvents.gameInfo$
            .pipe(
                takeUntil(this._unsubscribe),
                tap((event) => (this.gameInfoList = createLogItem(event) + this.gameInfoList))
            )
            .subscribe(() => this.cdr.detectChanges());

        // Game Events
        this.gameEvents.gameEvent$
            .pipe(
                takeUntil(this._unsubscribe),
                tap((event) => (this.gameEventList = createLogItem(event) + this.gameEventList))
            )
            .subscribe(() => this.cdr.detectChanges());

        // Game Stages
        this.gameEvents.gameStage$
            .pipe(
                takeUntil(this._unsubscribe),
                tap((stage) => (this.gameStage = stage))
            )
            .subscribe(() => this.cdr.detectChanges());

        // Game Mode
        this.gameEvents.gameMode$
            .pipe(
                takeUntil(this._unsubscribe),
                tap((event) => (this.gameMode = getFriendlyGameMode(event)))
            )
            .subscribe(() => this.cdr.detectChanges());

        // Game Map
        this.gameEvents.gameMapName$
            .pipe(
                takeUntil(this._unsubscribe),
                tap((mapName) => (this.gameMapName = getFriendlyMapName(mapName)))
            )
            .subscribe(() => this.cdr.detectChanges());

        // Game Match Time
        this.gameEvents.gameMatchTime$
            .pipe(
                takeUntil(this._unsubscribe),
                tap((matchTime) => (this.matchStartDate = matchTime.start)),
                tap((matchTime) => (this.matchEndDate = matchTime.end)),
                tap((matchTime) => (this.matchDurationMs = matchTime.durationMs))
            )
            .subscribe(() => this.cdr.detectChanges());

        // Player Name
        this.gameEvents.playerName$
            .pipe(
                takeUntil(this._unsubscribe),
                tap((event) => (this.playerName = event))
            )
            .subscribe(() => this.cdr.detectChanges());

        // Player Legend
        this.gameEvents.playerLegend$
            .pipe(
                takeUntil(this._unsubscribe),
                tap((legend) => (this.playerLegend = getFriendlyLegendName(legend)))
            )
            .subscribe(() => this.cdr.detectChanges());

        // Player Locations
        this.gameEvents.playerInGameLocation$
            .pipe(
                takeUntil(this._unsubscribe),
                tap((event) => (this.playerLocation = JSON.stringify(event)))
            )
            .subscribe(() => this.cdr.detectChanges());

        // Ultimate Percent
        type MeUltimateCooldown = overwolf.gep.ApexLegends.ApexLegendsMatchInfoMeUltimateCooldown;
        this.gameEvents.gameInfo$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((infoData) => infoData?.feature === "me" && !!infoData.info.me?.ultimate_cooldown),
                map((infoData) => {
                    const ultCooldownJSON = infoData?.info.me?.ultimate_cooldown;
                    const ultCooldownObj = JSONTryParse<MeUltimateCooldown>(ultCooldownJSON as string);
                    const ultCooldown = parseInt(ultCooldownObj?.ultimate_cooldown as string);
                    return ultCooldown / 100;
                }),
                tap((ultimatePercent) => (this.ultimatePercent = ultimatePercent))
            )
            .subscribe(() => this.cdr.detectChanges());

        // Squadmates
        this.gameEvents.playerSquadmates$
            .pipe(
                takeUntil(this._unsubscribe),
                tap((event) => {
                    let squadmates = "";
                    event.forEach((sm) => {
                        squadmates += `${squadmates.length ? "\n" : ""}`;
                        squadmates += `${sm?.playerName} (${getFriendlyLegendName(sm?.legendName)})`;
                    });
                    this.playerSquadmates = squadmates;
                })
            )
            .subscribe(() => this.cdr.detectChanges());
    }

    private registerBackgroundEvents(): void {
        const showReportedDuration = 120 * 1000;

        const hasTrackedFn = (value: boolean): void => {
            this.hasRecentlyTrackedMatchSummary = value;
            this.cdr.detectChanges();
        };

        this.backgroundService.lastMatchSummary
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
