import { Legend } from "@allfather-app/app/common/legend/legend";
import { DefaultSetting, SettingKey } from "@allfather-app/app/common/settings";
import { AvgMatchStats } from "@allfather-app/app/common/utilities/match-stats";
import { ConfigurationService } from "@allfather-app/app/modules/core/configuration.service";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { combineLatest, of, Subject, Subscription } from "rxjs";
import { switchMap, takeUntil } from "rxjs/operators";
import { PlayerLocalStatsService } from "../../core/player-local-stats.service";
import { SettingsService } from "../../core/settings.service";
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
    public legendIconRows: LegendIconRow[] = [];
    public complimentaryLegendWeights: { legendId: string; weightScore: number }[] = [];
    public minLegendStatsMatches = 1;
    public minShowComplimentaryLegendsMatches = 10;
    public isLegendStatsEnabled = false;
    public isComplimentaryLegendsEnabled = false;
    public get focusedLegendName(): Optional<string> {
        return this.focusedLegendId ? Legend.getName(this.focusedLegendId) : undefined;
    }

    private legendStatsSubscription?: Subscription;
    private complimentaryLegendsSubscription?: Subscription;
    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly configuration: ConfigurationService,
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

    public showComplimentaryLegends(legendId: string): void {
        this.complimentaryLegendsSubscription?.unsubscribe();
        this.complimentaryLegendsSubscription = this.configuration.config$
            .pipe(
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
                console.debug(`
                ## LegendSelectLegendStats ##
                DefaultValue: ${defaultValue}
                Setting: ${isSettingEnabled}
                Config: ${isConfigEnabled}
                `);
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
                console.debug(`
                ## LegendSelectLegendComplimentary ##
                DefaultValue: ${defaultValue}
                Setting: ${isSettingEnabled}
                Config: ${isConfigEnabled}
                `);
                this.cdr.detectChanges();
            });
    }
}
