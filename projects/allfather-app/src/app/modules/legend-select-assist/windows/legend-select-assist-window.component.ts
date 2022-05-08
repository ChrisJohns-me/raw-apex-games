import { Legend } from "@allfather-app/app/common/legend/legend";
import { MatchGameModeList } from "@allfather-app/app/common/match/game-mode/game-mode-list";
import { MatchGameModeGenericId } from "@allfather-app/app/common/match/game-mode/game-mode.enum";
import { OverwolfWindowName } from "@allfather-app/app/common/overwolf-window";
import { SettingKey } from "@allfather-app/app/common/settings";
import { AvgMatchStats } from "@allfather-app/app/common/utilities/match-stats";
import { ConfigurationService } from "@allfather-app/app/modules/core/configuration.service";
import { SettingsService } from "@allfather-app/app/modules/core/settings.service";
import { Configuration } from "@allfather-app/configs/config.interface";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Stopwatch } from "common/utilities";
import { unique } from "common/utilities/primitives/array";
import { combineLatest, from, Observable, Subject, Subscription } from "rxjs";
import { concatMap, filter, finalize, map, startWith, switchMap, take, takeUntil, tap } from "rxjs/operators";
import { MatchService } from "../../core/match/match.service";
import { PlayerLocalStatsService } from "../../core/player-local-stats.service";
import { LegendIconRow } from "../legend-select-icon-row.interface";

@Component({
    selector: "app-legend-select-assist-window",
    templateUrl: "./legend-select-assist-window.component.html",
    styleUrls: ["./legend-select-assist-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegendSelectAssistWindowComponent implements OnInit, OnDestroy {
    public focusedLegendId?: string;
    public legendStats?: AvgMatchStats;
    public legendGameModeStats?: AvgMatchStats;
    public isBattleRoyaleGameMode = false;
    public isArenasGameMode = false;
    public isControlGameMode = false;
    public legendIconRows: LegendIconRow[] = [];
    public complimentaryLegendWeights: { legendId: string; weightScore: number }[] = [];
    public minLegendStatsMatches = 1;
    public isLegendStatsEnabled = false;
    public isComplimentaryLegendsEnabled = false;
    public get focusedLegendName(): Optional<string> {
        return this.focusedLegendId ? Legend.getName(this.focusedLegendId) : undefined;
    }
    //#region Config
    public get minShowComplimentaryLegendsMatches(): Optional<number> {
        return this.config?.featureConfigs.legendSelectAssist.minShowComplimentaryLegendsMatches;
    }
    public get limitComplimentaryLegendsMatches(): Optional<number> {
        return this.config?.featureConfigs.legendSelectAssist.limitComplimentaryLegendsMatches;
    }
    public get maxComplimentaryLegends(): Optional<number> {
        return this.config?.featureConfigs.legendSelectAssist.maxComplimentaryLegends;
    }
    public get limitLegendStatsMatches(): Optional<number> {
        return this.config?.featureConfigs.legendSelectAssist.limitLegendStatsMatches;
    }
    //#endregion

    public readonly OverwolfWindowName = OverwolfWindowName;

    private hoverLegendSubscription?: Subscription;
    private config?: Configuration;
    private readonly brGameModeIds = unique(MatchGameModeList.filter((gm) => gm.isBattleRoyaleGameMode).map((gm) => gm.gameModeGenericId));
    private readonly arenasGameModeIds = unique(MatchGameModeList.filter((gm) => gm.isArenasGameMode).map((gm) => gm.gameModeGenericId));
    private readonly controlGameModeIds = unique(MatchGameModeList.filter((gm) => gm.isControlGameMode).map((gm) => gm.gameModeGenericId));
    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly configuration: ConfigurationService,
        private readonly match: MatchService,
        private readonly playerStats: PlayerLocalStatsService,
        private readonly settings: SettingsService
    ) {}

    public ngOnInit(): void {
        this.configuration.config$.pipe(takeUntil(this.destroy$)).subscribe((config) => {
            this.config = config;
            this.legendIconRows = config.featureConfigs.legendSelectAssist.legendRows;
            this.preloadLegendStats(this.legendIconRows);
            this.refreshUI();
        });
        this.setupSettingsListener();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public hoverLegend(legendId: string): void {
        this.focusedLegendId = legendId;
        this.refreshUI();
        this.hoverLegendSubscription?.unsubscribe();

        this.hoverLegendSubscription = combineLatest([
            this.getLegendStats$(legendId).pipe(
                startWith(undefined),
                filter(() => legendId === this.focusedLegendId),
                tap((legendStats) => (this.legendStats = legendStats))
            ),
            this.getLegendGameModeStats$(legendId).pipe(
                startWith(undefined),
                filter(() => legendId === this.focusedLegendId),
                tap((legendGameModeStats) => (this.legendGameModeStats = legendGameModeStats))
            ),
            this.getComplimentaryLegends$(legendId).pipe(
                startWith([]),
                filter(() => legendId === this.focusedLegendId),
                tap((complimentaryLegendWeights) => (this.complimentaryLegendWeights = complimentaryLegendWeights))
            ),
        ])
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.refreshUI());
    }

    /**
     * Listens to changes from Settings
     */
    private setupSettingsListener(): void {
        combineLatest([this.configuration.config$, this.settings.streamSetting$<boolean>(SettingKey.EnableLegendSelectLegendStats)])
            .pipe(takeUntil(this.destroy$))
            .subscribe(([config, setting]) => {
                const isSettingEnabled = !!setting?.value;
                const isConfigEnabled = config.featureFlags.legendSelectAssist.legendStats;
                this.isLegendStatsEnabled = isSettingEnabled && isConfigEnabled;
                this.refreshUI();
            });

        combineLatest([this.configuration.config$, this.settings.streamSetting$<boolean>(SettingKey.EnableLegendSelectLegendSuggestions)])
            .pipe(takeUntil(this.destroy$))
            .subscribe(([config, setting]) => {
                const isSettingEnabled = !!setting?.value;
                const isConfigEnabled = config.featureFlags.legendSelectAssist.complimentaryLegends;
                this.isComplimentaryLegendsEnabled = isSettingEnabled && isConfigEnabled;
                this.refreshUI();
            });
    }

    private preloadLegendStats(legendIdsRows: LegendIconRow[]): void {
        const allLegendIds = legendIdsRows.flatMap((row) => row.legendIds);
        console.info(`[LegendSelectAssist] Preloading Legend Stats for ${allLegendIds.length} legends`);

        const stopwatch = new Stopwatch();
        stopwatch.start();
        from(allLegendIds)
            .pipe(
                takeUntil(this.destroy$),
                concatMap((legendId) =>
                    combineLatest([
                        this.getLegendStats$(legendId, true),
                        this.getLegendGameModeStats$(legendId, true),
                        this.getComplimentaryLegends$(legendId, true),
                    ])
                ),
                finalize(() => {
                    stopwatch.stop();
                    console.info(`[LegendSelectAssist] Preloaded Legend Stats in ${stopwatch.result()}ms`);
                    this.refreshUI();
                })
            )
            .subscribe();
    }

    //#region Legend Stats Observables
    private getLegendStats$(legendId: string, breakCache = false): Observable<AvgMatchStats> {
        return this.playerStats.getLegendStats$(legendId, this.limitLegendStatsMatches, breakCache);
    }

    private getLegendGameModeStats$(legendId: string, breakCache = false): Observable<AvgMatchStats> {
        return this.match.gameMode$.pipe(
            take(1),
            switchMap((gameMode) => {
                this.isBattleRoyaleGameMode = !!gameMode?.isBattleRoyaleGameMode;
                this.isArenasGameMode = !!gameMode?.isArenasGameMode;
                this.isControlGameMode = !!gameMode?.isControlGameMode;
                let gameModeGenericIds: MatchGameModeGenericId[] = [];
                if (this.isBattleRoyaleGameMode) gameModeGenericIds = this.brGameModeIds;
                else if (this.isArenasGameMode) gameModeGenericIds = this.arenasGameModeIds;
                else if (this.isControlGameMode) gameModeGenericIds = this.controlGameModeIds;

                return this.playerStats.getLegendGameModeGenericStats$(
                    legendId,
                    gameModeGenericIds,
                    this.limitLegendStatsMatches,
                    breakCache
                );
            })
        );
    }

    private getComplimentaryLegends$(legendId: string, breakCache = false): Observable<{ legendId: string; weightScore: number }[]> {
        return this.playerStats
            .getLegendComplimentaryLegendWeights$(legendId, this.limitComplimentaryLegendsMatches, breakCache)
            .pipe(map((legendWeights) => legendWeights.slice(0, this.maxComplimentaryLegends)));
    }
    //#endregion

    private refreshUI(): void {
        this.cdr.detectChanges();
    }
}
