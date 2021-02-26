import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from "@angular/core";
import { GameEventsService } from "@core/game";
import { format } from "date-fns";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
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
        this.gameEvents.gameProcessUpdate$.pipe(takeUntil(this._unsubscribe)).subscribe((event) => {
            this.gameProcessInfoList = createLogItem(event) + this.gameProcessInfoList;
            this.cdr.markForCheck();
        });
        this.gameEvents.gameInfo$.pipe(takeUntil(this._unsubscribe)).subscribe((event) => {
            this.gameInfoList = createLogItem(event) + this.gameInfoList;
            this.cdr.markForCheck();
        });
        this.gameEvents.gameEvent$.pipe(takeUntil(this._unsubscribe)).subscribe((event) => {
            this.gameEventList = createLogItem(event) + this.gameEventList;
            this.cdr.markForCheck();
        });
        this.gameEvents.gameStage$.pipe(takeUntil(this._unsubscribe)).subscribe((event) => {
            this.gameStage = event;
            this.cdr.markForCheck();
        });
        this.gameEvents.gameMode$.pipe(takeUntil(this._unsubscribe)).subscribe((event) => {
            this.gameMode = event;
            this.cdr.markForCheck();
        });
        this.gameEvents.playerName$.pipe(takeUntil(this._unsubscribe)).subscribe((event) => {
            this.playerName = event;
            this.cdr.markForCheck();
        });
        this.gameEvents.playerLegend$.pipe(takeUntil(this._unsubscribe)).subscribe((event) => {
            this.playerLegend = event;
            this.cdr.markForCheck();
        });
        this.gameEvents.playerLocation$.pipe(takeUntil(this._unsubscribe)).subscribe((event) => {
            this.playerLocation = JSON.stringify(event);
            this.cdr.markForCheck();
        });
        this.gameEvents.playerSquadmates$.pipe(takeUntil(this._unsubscribe)).subscribe((event) => {
            let squadmates = "";
            event.forEach((sm) => (squadmates = `${squadmates}${squadmates.length ? "\n" : ""}${sm?.playerName}`));
            this.playerSquadmates = squadmates;
            this.cdr.markForCheck();
        });
    }
}

function createLogItem(input: any): string {
    const now = new Date();
    const dateStr = format(now, "h:mm:ss.SSS");
    const eventStr = JSON.stringify(input);
    return `[${dateStr}] ${eventStr}\n`;
}
