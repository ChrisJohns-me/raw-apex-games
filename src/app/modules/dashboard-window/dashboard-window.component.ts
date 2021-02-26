import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from "@angular/core";
import { getFriendlyLegendName } from "@common/legend";
import { GameEventsService } from "@core/game";
import { differenceInMilliseconds, format } from "date-fns";
import { Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { InGameTestWindowService } from "../in-game-test-window/in-game-test-window.service";

@Component({
    selector: "app-dashboard-window",
    templateUrl: "./dashboard-window.component.html",
    styleUrls: ["./dashboard-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardWindowComponent implements OnDestroy {
    public primaryTitle = "Dashboard";
    public secondaryTitle = "";

    public gameProcessInfoList = "";
    public gameInfoList = "";
    public gameEventList = "";
    public gameStage = "";
    public gameMode = "";
    public playerName = "";
    public playerLegend = "";
    public playerLocation = "";
    public playerSquadmates = "";
    public matchStartDate?: Date;
    public matchEndDate?: Date;
    /** Duration in milliseconds */
    public get matchDuration(): number {
        if (!this.matchStartDate) return 0;
        const endDate = this.matchEndDate ?? new Date();
        return differenceInMilliseconds(endDate, this.matchStartDate);
    }

    private _unsubscribe = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly gameEvents: GameEventsService,
        private readonly inGameTestWindow: InGameTestWindowService
    ) {
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
        console.debug("opening in game test window");
        this.inGameTestWindow.open().subscribe();
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
            .subscribe(() => this.cdr.markForCheck());

        // Game Info
        this.gameEvents.gameInfo$
            .pipe(
                takeUntil(this._unsubscribe),
                tap((event) => (this.gameInfoList = createLogItem(event) + this.gameInfoList)),
                tap((infoData) => {
                    if (infoData?.feature === "match_state" && infoData.info?.game_info?.match_state === "active") {
                        this.matchStartDate = new Date();
                        delete this.matchEndDate;
                    } else if (
                        infoData?.feature === "match_state" &&
                        infoData.info?.game_info?.match_state === "inactive"
                    ) {
                        this.matchEndDate = new Date();
                    }
                })
            )
            .subscribe(() => this.cdr.markForCheck());

        // Game Events
        this.gameEvents.gameEvent$
            .pipe(
                takeUntil(this._unsubscribe),
                tap((event) => (this.gameEventList = createLogItem(event) + this.gameEventList))
            )
            .subscribe(() => this.cdr.markForCheck());

        // Game Stages
        this.gameEvents.gameStage$
            .pipe(
                takeUntil(this._unsubscribe),
                tap((stage) => (this.gameStage = stage))
            )
            .subscribe(() => this.cdr.markForCheck());

        // Game Mode
        this.gameEvents.gameMode$
            .pipe(
                takeUntil(this._unsubscribe),
                tap((event) => (this.gameMode = event))
            )
            .subscribe(() => this.cdr.markForCheck());

        // Player Name
        this.gameEvents.playerName$
            .pipe(
                takeUntil(this._unsubscribe),
                tap((event) => (this.playerName = event))
            )
            .subscribe(() => this.cdr.markForCheck());

        // Player Legend
        this.gameEvents.playerLegend$
            .pipe(
                takeUntil(this._unsubscribe),
                tap((event) => (this.playerLegend = event))
            )
            .subscribe(() => this.cdr.markForCheck());

        // Player Locations
        this.gameEvents.playerLocation$
            .pipe(
                takeUntil(this._unsubscribe),
                tap((event) => (this.playerLocation = JSON.stringify(event)))
            )
            .subscribe(() => this.cdr.markForCheck());

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
            .subscribe(() => this.cdr.markForCheck());
    }
}

function createLogItem(input: any): string {
    const now = new Date();
    const dateStr = format(now, "h:mm:ss.SSS");
    const eventStr = JSON.stringify(input);
    return `[${dateStr}] ${eventStr}\n`;
}
