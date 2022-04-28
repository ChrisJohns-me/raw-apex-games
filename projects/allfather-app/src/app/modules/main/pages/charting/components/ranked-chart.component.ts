import { Rank, RankTierName } from "@allfather-app/app/common/rank/rank";
import { MatchDataStore } from "@allfather-app/app/modules/core/local-database/match-data-store";
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, ViewChild } from "@angular/core";
import {
    CategoryScale,
    Chart,
    ChartDataset,
    ChartOptions,
    Legend,
    LinearScale,
    LineController,
    LineElement,
    PointElement,
    ScriptableLineSegmentContext,
    TimeScale,
    Tooltip,
    TooltipItem,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { isEmpty } from "common/utilities/";
import { subDays } from "date-fns";
import {
    ChartRankBronzeHEXColor,
    ChartRankDiamondHEXColor,
    ChartRankGoldHEXColor,
    ChartRankMasterHEXColor,
    ChartRankPlatinumHEXColor,
    ChartRankSilverHEXColor,
} from "./chart";

@Component({
    selector: "app-ranked-chart",
    styles: [
        `
            .ranked-chart-container {
                height: 20vw;
            }
        `,
    ],
    template: `
        <div class="ranked-chart-container">
            <canvas #chartRef></canvas>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RankedChartComponent implements AfterViewInit, OnChanges {
    @Input() public matchList: MatchDataStore[] = [];

    private recentMatchList: MatchDataStore[] = [];
    private get chartOptions(): ChartOptions {
        return {
            responsive: true,
            interaction: {
                intersect: false,
                mode: "nearest",
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    xAlign: "center",
                    yAlign: "top",
                    callbacks: {
                        beforeTitle: (tooltipItems: TooltipItem<"line">[]): string => {
                            const ctxRankScore = tooltipItems[0]?.raw;
                            if (typeof ctxRankScore !== "number") return "";
                            return Rank.getTierNameFromScore(ctxRankScore);
                        },
                    },
                },
            },
            scales: {
                x: {
                    type: "time",
                    axis: "x",
                    time: {
                        unit: "day",
                        tooltipFormat: "MMM dd, K:mm a",
                        displayFormats: {
                            day: "MMM dd",
                        },
                    },
                },
                y: {
                    axis: "y",
                    type: "linear",
                    ticks: {
                        display: false,
                    },
                },
            },
            maintainAspectRatio: false,
        };
    }

    @ViewChild("chartRef") public chartRef?: ElementRef<HTMLCanvasElement>;
    private chart?: Chart;
    private readonly numDaysToShow = 30;
    private dataLabels: string[] = [];
    private datasets: ChartDataset[] = [];

    constructor() {
        Chart.register(LineElement, PointElement, LineController, CategoryScale, TimeScale, LinearScale, Legend, Tooltip);
    }

    public ngAfterViewInit(): void {
        this.loadChartData();
        this.drawGraph();
    }

    public ngOnChanges(): void {
        this.loadChartData();
        this.drawGraph();
    }

    private drawGraph(): void {
        if (!this.chartRef?.nativeElement) return;
        if (this.chart) this.chart.destroy();
        this.chart = new Chart(this.chartRef.nativeElement, {
            type: "line",
            data: {
                labels: this.dataLabels,
                datasets: this.datasets,
            },
            options: this.chartOptions,
        });
    }

    private loadChartData(): void {
        if (isEmpty(this.matchList)) return;
        const now = new Date();
        const rankScores: number[] = [];
        this.dataLabels = [];

        const matchList = this.matchList
            .slice()
            .sort((a, b) => (a.startDate?.getTime() ?? Infinity) - (b.startDate?.getTime() ?? Infinity));
        const recentStartDate = subDays(now, this.numDaysToShow);
        this.recentMatchList = matchList.filter((match) => (match.endDate ?? 0) > recentStartDate);

        for (const recentMatch of this.recentMatchList) {
            if (!recentMatch.endDate || !recentMatch.rankScore) continue;
            this.dataLabels.push(recentMatch.endDate.toISOString());
            rankScores.push(recentMatch.rankScore);
        }

        this.datasets = [
            {
                label: "Rank Score",
                data: rankScores,
                stepped: false,
                segment: {
                    borderColor: (ctx: ScriptableLineSegmentContext) => {
                        const ctxRankScore = ctx.p0.parsed.y;
                        const ctxRankTierName: RankTierName = Rank.getTierNameFromScore(ctxRankScore);
                        if (ctxRankTierName === RankTierName.Bronze) return ChartRankBronzeHEXColor;
                        else if (ctxRankTierName === RankTierName.Silver) return ChartRankSilverHEXColor;
                        else if (ctxRankTierName === RankTierName.Gold) return ChartRankGoldHEXColor;
                        else if (ctxRankTierName === RankTierName.Platinum) return ChartRankPlatinumHEXColor;
                        else if (ctxRankTierName === RankTierName.Diamond) return ChartRankDiamondHEXColor;
                        else if (ctxRankTierName === RankTierName.Master) return ChartRankMasterHEXColor;
                        return;
                    },
                },
            },
        ];
    }
}
