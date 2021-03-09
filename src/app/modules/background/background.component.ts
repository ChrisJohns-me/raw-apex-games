import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { GameStage } from "@common/game";
import { GameEventsService } from "@core/game";
import { UIWindowEventsService } from "@core/ui-window";
import { combineLatest, merge, Observable, of, Subject } from "rxjs";
import { filter, map, startWith, switchMap, takeUntil, tap } from "rxjs/operators";
import { JSONTryParse } from "src/utilities";
import { DashboardWindowService } from "../dashboard-window/dashboard-window.service";
import { InGameMatchTimerWindowService } from "../in-game-match-timer-window/in-game-match-timer-window.service";
import { InGameUltimateCountdownWindowService } from "../in-game-ultimate-countdown-window/in-game-ultimate-countdown-window.service";
import { BackgroundService } from "./background.service";

// type MatchInfoTabs = Exclude<string, overwolf.gep.ApexLegends.ApexLegendsMatchInfoTabs>;
type MatchInfoTabs = overwolf.gep.ApexLegends.ApexLegendsMatchInfoTabs;

export interface MatchSummary {
    kills?: number;
    legend?: string;
    damage?: number;
    map?: string;
    placement?: number;
    gameMode?: string;
    durationMs?: number;
}

@Component({
    selector: "app-background",
    template: "",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgroundComponent implements OnInit, OnDestroy {
    public unreportedMatchSummary?: MatchSummary;

    private readonly _unsubscribe = new Subject<void>();

    constructor(
        private readonly dashboardWindow: DashboardWindowService,
        private readonly backgroundService: BackgroundService,
        private readonly gameEvents: GameEventsService,
        private readonly matchTimerWindow: InGameMatchTimerWindowService,
        private readonly uiWindowEvents: UIWindowEventsService,
        private readonly ultimateCountdownWindow: InGameUltimateCountdownWindowService
    ) {}

    public ngOnInit(): void {
        this.registerGameEvents();
        this.registerUIWindows();
        this.registerTracking();
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private registerGameEvents(): void {
        merge(
            this.gameEvents.gameProcessUpdate$,
            this.gameEvents.gameInfo$,
            this.gameEvents.gameEvent$,
            this.gameEvents.gameStage$,
            this.gameEvents.gameMatchTime$
        )
            .pipe(takeUntil(this._unsubscribe))
            .subscribe();
    }

    private registerUIWindows(): void {
        merge(this.dashboardWindow.open(), this.matchTimerWindow.open(), this.ultimateCountdownWindow.open())
            .pipe(takeUntil(this._unsubscribe))
            .subscribe();
    }

    private registerTracking(): void {
        this.gameEvents.gameStage$.pipe(takeUntil(this._unsubscribe)).subscribe((gameStage) => {
            console.log(`[${this.constructor.name}]GameStage; ${gameStage}`);
        });

        let isTracking = false;
        let isReportTriggered = false;
        const tabs$ = this.gameEvents.gameInfo$.pipe(
            filter((gameInfo) => gameInfo?.feature === "match_info" && !!gameInfo?.info.match_info?.tabs),
            map((gameInfo) => gameInfo?.info.match_info?.tabs),
            map((rawTabs) => JSONTryParse<MatchInfoTabs>(rawTabs as string)),
            startWith(null)
        );
        const gameStage$ = this.gameEvents.gameStage$.pipe(
            tap((gameStage) => {
                if (gameStage === GameStage.InGame) isTracking = true;
                else if (gameStage === GameStage.Lobby) isReportTriggered = true;
            }),
            startWith(null)
        );

        combineLatest([
            tabs$,
            gameStage$,
            this.gameEvents.playerLegend$.pipe(startWith(null)),
            this.gameEvents.gameMapName$.pipe(startWith(null)),
            this.gameEvents.gameMode$.pipe(startWith(null)),
            this.gameEvents.gameMatchTime$.pipe(startWith(null)),
        ])
            .pipe(
                takeUntil(this._unsubscribe),
                filter(() => {
                    const isTrackingEnabled = this.backgroundService.isTrackingEnabled;
                    if (!isTrackingEnabled && (isTracking || isReportTriggered)) {
                        isTracking = isReportTriggered = false;
                        delete this.unreportedMatchSummary;
                    }
                    return isTrackingEnabled;
                }),
                tap(([tabs, gameStage, playerLegend, mapName, gameMode, matchTime]) => {
                    this.unreportedMatchSummary = {
                        kills: tabs?.kills,
                        legend: playerLegend ?? undefined,
                        damage: tabs?.damage,
                        map: mapName ?? undefined,
                        placement: tabs?.teams,
                        gameMode: gameMode ?? undefined,
                        durationMs: matchTime?.durationMs,
                    };
                }),
                filter(() => isTracking && isReportTriggered),
                tap(() => (isReportTriggered = isTracking = false)),
                switchMap(() => this.reportMatchSummary(this.unreportedMatchSummary))
            )
            .subscribe((result) => {
                console.debug("Match Summary Tracked:", result.success);
                delete this.unreportedMatchSummary;
            });
    }

    private reportMatchSummary(summary?: MatchSummary): Observable<{ success: boolean }> {
        if (!this.backgroundService.isTrackingEnabled) return of();
        if (!summary || !summary.legend || (summary.placement ?? 0) <= 0)
            return of({ success: false, error: new Error("Missing Match Summary when attempting to track.") });

        return this.backgroundService.reportMatchSummaryToGoogleForms(summary).pipe(
            tap((response) => {
                if (response.success) {
                    this.backgroundService.setLastMatchSummaryReported(summary);
                } else {
                    alert("Tried to track match summary, got an error:\n" + response.error);
                }
            })
        );
    }
}
