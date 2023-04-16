import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, ViewChild } from "@angular/core";
import { MatchDataStore } from "@app/app/modules/core/local-database/match-data-store";
import {
    CategoryScale,
    Chart,
    ChartDataset,
    ChartOptions,
    Legend,
    LineController,
    LineElement,
    LinearScale,
    PointElement,
    Tooltip,
    TooltipItem,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { isEmpty } from "common/utilities/";

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
                    callbacks: {
                        beforeTitle: (tooltipItems: TooltipItem<"line">[]): string => {
                            return "";
                        },
                    },
                },
            },
            scales: {
                x: {
                    axis: "x",
                    ticks: {
                        display: false,
                    },
                    reverse: true,
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
    private readonly numMatchesToShow = 100;
    private dataLabels: string[] = [];
    private datasets: ChartDataset[] = [];

    constructor() {
        Chart.register(LineElement, PointElement, LineController, CategoryScale, LinearScale, Legend, Tooltip);
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
        const rankScores: number[] = [];
        this.dataLabels = [];
        // const matchList = this.matchList.filter((match) => !isEmpty(match.rankScore)).slice(0, this.numMatchesToShow);

        // for (const match of matchList) {
        //     if (!match.rankScore) continue;
        //     rankScores.push(match.rankScore);
        //     this.dataLabels.push(match.endDate ? format(match.endDate, "MMM dd, K:mm a") : "");
        // }

        // this.datasets = [
        //     {
        //         label: "Rank Score",
        //         data: rankScores,
        //         stepped: false,
        //         segment: {
        //             borderColor: (ctx: ScriptableLineSegmentContext) => {
        //                 const ctxRankScore = ctx.p0.parsed.y;
        //                 const ctxRankTierName: RankTierName = Rank.getTierNameFromScore(ctxRankScore);
        //                 if (ctxRankTierName === RankTierName.Rookie) return ChartRankRookieHEXColor;
        //                 else if (ctxRankTierName === RankTierName.Bronze) return ChartRankBronzeHEXColor;
        //                 else if (ctxRankTierName === RankTierName.Silver) return ChartRankSilverHEXColor;
        //                 else if (ctxRankTierName === RankTierName.Gold) return ChartRankGoldHEXColor;
        //                 else if (ctxRankTierName === RankTierName.Platinum) return ChartRankPlatinumHEXColor;
        //                 else if (ctxRankTierName === RankTierName.Diamond) return ChartRankDiamondHEXColor;
        //                 else if (ctxRankTierName === RankTierName.Master) return ChartRankMasterHEXColor;
        //                 return;
        //             },
        //         },
        //     },
        // ];
    }
}
