import { DefaultSetting, SettingKey } from "@allfather-app/app/common/settings";
import { ConfigurationService } from "@allfather-app/app/modules/core/configuration.service";
import { SettingsService } from "@allfather-app/app/modules/core/settings.service";
import { AvgMatchStats } from "@allfather-app/app/modules/core/utilities/match-stats";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Legend } from "@shared-app/legend/legend";
import { MatchGameModeList } from "@shared-app/match/game-mode/game-mode-list";
import { combineLatest, of, Subject, Subscription } from "rxjs";
import { map, switchMap, takeUntil, tap } from "rxjs/operators";
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
    public isArenasGameMode = false;
    public legendIconRows: LegendIconRow[] = [];
    public complimentaryLegendWeights: { legendId: string; weightScore: number }[] = [];
    public minLegendStatsMatches = 1;
    public minShowComplimentaryLegendsMatches = 0;
    public isLegendStatsEnabled = false;
    public isComplimentaryLegendsEnabled = false;
    public get focusedLegendName(): Optional<string> {
        return this.focusedLegendId ? Legend.getName(this.focusedLegendId) : undefined;
    }

    private legendStatsSubscription?: Subscription;
    private complimentaryLegendsSubscription?: Subscription;
    private brGameModeIds = MatchGameModeList.filter((gm) => gm.isBattleRoyaleGameMode).map((gm) => gm.gameModeGenericId);
    private arenasGameModeIds = MatchGameModeList.filter((gm) => gm.isArenasGameMode).map((gm) => gm.gameModeGenericId);
    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly configuration: ConfigurationService,
        private readonly match: MatchService,
        private readonly playerStats: PlayerLocalStatsService,
        private readonly settingsService: SettingsService
    ) {}

    public ngOnInit(): void {
        this.playerStats.clearLegendCache();
        this.setupLegendIconRows();
        this.setupSettingsListener();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public hoverLegend(legendId: string): void {
        this.showComplimentaryLegends(legendId);
        this.showLegendStats(legendId);
        this.showLegendGameModeStats(legendId);
        this.focusedLegendId = legendId;
        this.cdr.detectChanges();
    }

    public showLegendStats(legendId: string): void {
        this.legendStatsSubscription?.unsubscribe();
        this.legendStatsSubscription = this.configuration.config$
            .pipe(
                switchMap((config) =>
                    this.playerStats.getLegendStats$(legendId, config.featureConfigs.legendSelectAssist.limitLegendStatsMatches)
                )
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((avgStats) => {
                this.legendStats = avgStats;
                this.cdr.detectChanges();
            });
    }

    public showLegendGameModeStats(legendId: string): void {
        this.legendStatsSubscription?.unsubscribe();

        let limitLegendStatsMatches = 0;
        this.legendStatsSubscription = this.configuration.config$
            .pipe(
                tap((config) => (limitLegendStatsMatches = config.featureConfigs.legendSelectAssist.limitLegendStatsMatches)),
                switchMap(() => this.match.gameMode$),
                map((gameMode) => (this.isArenasGameMode = !!gameMode?.isArenasGameMode)),
                switchMap((isArenasGameMode) => {
                    return this.playerStats.getLegendGameModeGenericStats$(
                        legendId,
                        isArenasGameMode ? this.arenasGameModeIds : this.brGameModeIds,
                        limitLegendStatsMatches
                    );
                })
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((avgStats) => {
                this.legendGameModeStats = avgStats;
                this.cdr.detectChanges();
            });
    }

    public showComplimentaryLegends(legendId: string): void {
        this.complimentaryLegendsSubscription?.unsubscribe();
        this.complimentaryLegendsSubscription = this.configuration.config$
            .pipe(
                tap(
                    (config) =>
                        (this.minShowComplimentaryLegendsMatches =
                            config.featureConfigs.legendSelectAssist.minShowComplimentaryLegendsMatches)
                ),
                switchMap((config) =>
                    combineLatest([
                        of(config),
                        this.playerStats.getLegendComplimentaryLegendWeights$(
                            legendId,
                            config.featureConfigs.legendSelectAssist.limitComplimentaryLegendsMatches
                        ),
                    ])
                )
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe(([config, legendWeights]) => {
                const limitedLegendWeights = legendWeights.slice(0, config.featureConfigs.legendSelectAssist.maxComplimentaryLegends);
                this.complimentaryLegendWeights = limitedLegendWeights;
                this.cdr.detectChanges();
            });
    }

    private setupLegendIconRows(): void {
        this.configuration.config$.pipe(takeUntil(this.destroy$)).subscribe((config) => {
            this.legendIconRows = config.featureConfigs.legendSelectAssist.legendRows;
        });
    }

    /**
     * Listens to changes from Settings
     */
    private setupSettingsListener(): void {
        combineLatest([this.configuration.config$, this.settingsService.streamSetting$<boolean>(SettingKey.EnableLegendSelectLegendStats)])
            .pipe(takeUntil(this.destroy$))
            .subscribe(([config, setting]) => {
                const defaultValue = DefaultSetting.enableLegendSelectLegendStats as boolean;
                const isSettingEnabled = setting?.value != null ? setting.value : defaultValue;
                const isConfigEnabled = config.featureFlags.legendSelectAssist.legendStats;
                this.isLegendStatsEnabled = isSettingEnabled && isConfigEnabled;
                this.cdr.detectChanges();
            });

        combineLatest([
            this.configuration.config$,
            this.settingsService.streamSetting$<boolean>(SettingKey.EnableLegendSelectLegendSuggestions),
        ])
            .pipe(takeUntil(this.destroy$))
            .subscribe(([config, setting]) => {
                const defaultValue = DefaultSetting.enableLegendSelectLegendSuggestions as boolean;
                const isSettingEnabled = setting?.value != null ? setting.value : defaultValue;
                const isConfigEnabled = config.featureFlags.legendSelectAssist.complimentaryLegends;
                this.isComplimentaryLegendsEnabled = isSettingEnabled && isConfigEnabled;
                this.cdr.detectChanges();
            });
    }
}
