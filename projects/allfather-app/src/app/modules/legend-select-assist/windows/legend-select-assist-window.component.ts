import { Legend } from "@allfather-app/app/common/legend";
import { DefaultSetting, SettingKey } from "@allfather-app/app/common/settings";
import { AvgMatchStats } from "@allfather-app/app/common/utilities/match-stats";
import { ConfigurationService } from "@allfather-app/app/modules/core/configuration.service";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { PlayerStatsService } from "../../core/player-stats.service";
import { SettingsService } from "../../core/settings.service";
import { LegendIconRow } from "../legend-select-icon-row.interface";

@Component({
    selector: "app-legend-select-assist-window",
    templateUrl: "./legend-select-assist-window.component.html",
    styleUrls: ["./legend-select-assist-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegendSelectAssistWindowComponent implements OnInit, OnDestroy {
    public isVisible = false;
    public focusedLegendId?: string;
    public legendStats?: AvgMatchStats;
    public legendIconRows: LegendIconRow[] = this.config.featureConfigs.legendSelectAssist.legendRows;
    public complimentaryLegendWeights: { legendId: string; weightScore: number }[] = [];
    public minLegendStatsMatches = this.config.featureConfigs.legendSelectAssist.minLegendStatsMatches;
    public minShowComplimentaryLegendsMatches = this.config.featureConfigs.legendSelectAssist.minShowComplimentaryLegendsMatches;
    public get isLegendStatsEnabled(): boolean {
        return this._configIsLegendStatsEnabled && this._settingIsLegendStatsEnabled;
    }
    public get isComplimentaryLegendsEnabled(): boolean {
        return this._configIsComplimentaryLegendsEnabled && this._settingIsComplimentaryLegendsEnabled;
    }
    public get focusedLegendName(): Optional<string> {
        return this.focusedLegendId ? Legend.getName(this.focusedLegendId) : undefined;
    }

    public _configIsLegendStatsEnabled = this.config.featureFlags.legendSelectAssist.legendStats;
    public _configIsComplimentaryLegendsEnabled = this.config.featureFlags.legendSelectAssist.complimentaryLegends;
    public _settingIsLegendStatsEnabled = false;
    public _settingIsComplimentaryLegendsEnabled = false;

    private legendStatsSubscription?: Subscription;
    private complimentaryLegendsSubscription?: Subscription;
    private isDestroyed$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly config: ConfigurationService,
        private readonly playerStats: PlayerStatsService,
        private readonly settingsService: SettingsService
    ) {}

    public ngOnInit(): void {
        this.setupSettingsListener();
    }

    public ngOnDestroy(): void {
        this.isDestroyed$.next();
        this.isDestroyed$.complete();
    }

    public hoverLegend(legendId: string): void {
        this.showComplimentaryLegends(legendId);
        this.showLegendStats(legendId);
        this.focusedLegendId = legendId;
        this.cdr.detectChanges();
    }

    public showLegendStats(legendId: string): void {
        this.legendStatsSubscription?.unsubscribe();
        const limit = this.config.featureConfigs.legendSelectAssist.limitLegendStatsMatches;

        this.legendStatsSubscription = this.playerStats
            .getLegendStats$(legendId, limit)
            .pipe(takeUntil(this.isDestroyed$))
            .subscribe((avgStats) => {
                this.legendStats = avgStats;
                this.cdr.detectChanges();
            });
    }

    public showComplimentaryLegends(legendId: string): void {
        this.complimentaryLegendsSubscription?.unsubscribe();
        const limit = this.config.featureConfigs.legendSelectAssist.limitComplimentaryLegendsMatches;

        this.complimentaryLegendsSubscription = this.playerStats
            .getLegendComplimentaryLegendWeights$(legendId, limit)
            .pipe(takeUntil(this.isDestroyed$))
            .subscribe((legendWeights) => {
                const limitedLegendWeights = legendWeights.slice(0, this.config.featureConfigs.legendSelectAssist.maxComplimentaryLegends);
                this.complimentaryLegendWeights = limitedLegendWeights;
                this.cdr.detectChanges();
            });
    }

    private setupSettingsListener(): void {
        this.settingsService
            .streamSetting$<boolean>(SettingKey.EnableLegendSelectLegendStats)
            .pipe(takeUntil(this.isDestroyed$))
            .subscribe((setting) => {
                const defaultValue = DefaultSetting.enableLegendSelectLegendStats as boolean;
                this._settingIsLegendStatsEnabled = setting?.value != null ? setting.value : defaultValue;
                this.cdr.detectChanges();
            });

        this.settingsService
            .streamSetting$<boolean>(SettingKey.EnableLegendSelectLegendSuggestions)
            .pipe(takeUntil(this.isDestroyed$))
            .subscribe((setting) => {
                const defaultValue = DefaultSetting.enableLegendSelectLegendSuggestions as boolean;
                this._settingIsComplimentaryLegendsEnabled = setting?.value != null ? setting.value : defaultValue;
                this.cdr.detectChanges();
            });
    }
}
