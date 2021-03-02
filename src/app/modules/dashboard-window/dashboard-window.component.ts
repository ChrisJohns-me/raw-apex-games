import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { getFriendlyLegendName } from "@common/legend";
import { GameEventsService } from "@core/game";
import { format } from "date-fns";
import { Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { InGameMatchTimerWindowService } from "../in-game-match-timer-window/in-game-match-timer-window.service";
import { InGameTestWindowService } from "../in-game-test-window/in-game-test-window.service";

@Component({
    selector: "app-dashboard-window",
    templateUrl: "./dashboard-window.component.html",
    styleUrls: ["./dashboard-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardWindowComponent implements OnInit, OnDestroy {
    public primaryTitle = "Dashboard";
    public secondaryTitle = "";

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

    public get matchDurationDate(): Date | undefined {
        return this.matchDurationMs ? new Date(this.matchDurationMs) : undefined;
    }
    public matchStartDate?: Date;
    public matchEndDate?: Date;
    public matchDurationMs?: number;

    private _unsubscribe = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly gameEvents: GameEventsService,
        private readonly inGameTestWindow: InGameTestWindowService,
        private readonly inGameMatchTimerWindow: InGameMatchTimerWindowService
    ) {}

    public ngOnInit(): void {
        this.registerGameEvents();
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public onInjectInfoClick(): void {
        this.__injectFn("Info", (...args) => this.gameEvents.__debugInjectGameInfoEvent(...args));
    }

    public onInjectEventClick(): void {
        this.__injectFn("Event", (...args) => this.gameEvents.__debugInjectGameDataEvent(...args));
    }

    public onForceRefreshClick(): void {
        this.cdr.detectChanges();
    }

    public onOpenInGameClick(): void {
        this.inGameTestWindow.open().subscribe();
    }

    public onOpenMatchTimerClick(): void {
        this.inGameMatchTimerWindow.open().subscribe();
    }

    private __injectFn(name: string, eventFn: (event: any, delayMs: number) => void): void {
        let delayMs = 250;
        const inputInject = prompt(`Inject ${name} (JSON)`, "");
        const inputInjectParsed = JSON.tryParse(inputInject ?? "");

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

    private registerGameEvents(): void {
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
                tap((event) => (this.gameMode = event))
            )
            .subscribe(() => this.cdr.detectChanges());

        // Game Map
        this.gameEvents.gameMapName$
            .pipe(
                takeUntil(this._unsubscribe),
                tap((mapName) => (this.gameMapName = mapName))
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
                tap((event) => (this.playerLegend = event))
            )
            .subscribe(() => this.cdr.detectChanges());

        // Player Locations
        this.gameEvents.playerInGameLocation$
            .pipe(
                takeUntil(this._unsubscribe),
                tap((event) => (this.playerLocation = JSON.stringify(event)))
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
}

function createLogItem(input: any): string {
    const now = new Date();
    const dateStr = format(now, "h:mm:ss.SSS");
    const eventStr = JSON.stringify(input);
    return `[${dateStr}] ${eventStr}\n`;
}
