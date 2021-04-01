import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { OWGameEvent, OWInfoUpdates2Event } from "@core/overwolf-data-provider";
import { merge, Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { cleanInt } from "src/utilities";

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
    public autoTrimLog = false;
    public autoScroll = true;

    private gameLogStartTime?: Date;
    private _unsubscribe$ = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef) {}

    public ngOnInit(): void {
        this.setupAutoTrimLog();
        this.setupLogSubscription();
    }

    public ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    public clearLog(): void {
        this.gameLogStartTime = undefined;
        this.gameLogArr = [];
    }

    private setupAutoTrimLog(): void {
        // TODO
    }

    private setupLogSubscription(): void {
        if (!this.infoUpdates$) return void console.error(`[${this.constructor.name}] Unable to listen to InfoUpdates; empty data stream.`);
        if (!this.newGameEvent$) return void console.error(`[${this.constructor.name}] Unable to listen to GameEvents; empty data stream.`);

        merge(this.infoUpdates$, this.newGameEvent$)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((event) => {
                this.addLogItem(event);
            });
    }

    private addLogItem(input: any): void {
        if (!this.gameLogStartTime) this.gameLogStartTime = new Date();

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
