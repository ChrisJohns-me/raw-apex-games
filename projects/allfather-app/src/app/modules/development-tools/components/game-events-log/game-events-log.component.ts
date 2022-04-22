import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { OWGameEvent, OWInfoUpdates2Event } from "@allfather-app/app/modules/core/overwolf";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { cleanInt } from "common/utilities/";
import { merge, Observable, Subject } from "rxjs";
import { delay, filter, takeUntil } from "rxjs/operators";

interface GameLog {
    timestamp: Date;
    data: string;
}

@Component({
    selector: "app-game-events-log",
    templateUrl: "./game-events-log.component.html",
    styleUrls: ["./game-events-log.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameEventsLogComponent implements OnInit, OnDestroy {
    @Input("infoUpdates") public infoUpdates$!: Observable<OWInfoUpdates2Event>;
    @Input("newGameEvent") public newGameEvent$!: Observable<OWGameEvent>;
    @ViewChild("gameLog") private gameLogElement!: ElementRef;

    public gameLogArr: GameLog[] = [];
    public autoTrimLog = true;
    public get enableLogging(): boolean {
        return this._enableLogging;
    }
    public set enableLogging(value: boolean) {
        if (!value) this.clearLog();
        this._enableLogging = value;
    }
    public autoScroll = true;

    private _enableLogging = false;
    private destroy$ = new Subject<void>();

    constructor(private readonly match: MatchService, private readonly cdr: ChangeDetectorRef) {}

    public ngOnInit(): void {
        this.setupAutoTrimLog();
        this.setupLogSubscription();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public clearLog(): void {
        this.gameLogArr = [];
    }

    private setupAutoTrimLog(): void {
        this.match.endedEvent$
            .pipe(
                takeUntil(this.destroy$),
                filter(() => this.enableLogging && this.autoTrimLog),
                delay(30000)
            )
            .subscribe(() => this.clearLog());
    }

    private setupLogSubscription(): void {
        if (!this.infoUpdates$) return void console.error(`[${this.constructor.name}] Unable to listen to InfoUpdates; empty data stream.`);
        if (!this.newGameEvent$) return void console.error(`[${this.constructor.name}] Unable to listen to GameEvents; empty data stream.`);

        merge(this.infoUpdates$, this.newGameEvent$)
            .pipe(
                takeUntil(this.destroy$),
                filter(() => this.enableLogging)
            )
            .subscribe((event) => {
                this.addLogItem(event);
            });
    }

    private addLogItem(input: any): void {
        const eventStr = JSON.stringify(input)?.trim();
        if (eventStr) this.gameLogArr.push({ data: eventStr, timestamp: new Date() });

        this.cdr.detectChanges();
        this.logScrollToBottom();
    }

    private logScrollToBottom(): void {
        const elem: HTMLElement = this.gameLogElement?.nativeElement;
        if (!elem || !this.autoScroll) return;
        const scrollbarXHeight = cleanInt(elem.offsetHeight - elem.clientHeight);

        elem.scrollTo({
            top: elem.scrollHeight + scrollbarXHeight,
            behavior: "smooth",
        });
    }
}
