import { Legend } from "@allfather-app/app/common/legend/legend";
import { matchListAvgStatsGroupedBy } from "@allfather-app/app/common/utilities/match-stats";
import { MatchDataStore } from "@allfather-app/app/modules/core/local-database/match-data-store";
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, ViewChild } from "@angular/core";
import {
    ArcElement,
    CategoryScale,
    Chart,
    ChartDataset,
    ChartOptions,
    Legend as ChartLegend,
    LinearScale,
    PieController,
    Tooltip,
} from "chart.js";
import "chartjs-adapter-date-fns";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { isEmpty } from "common/utilities/";

@Component({
    selector: "app-legend-pickrate-chart",
    styles: [
        `
            .legend-pickrate-chart-container {
                height: 20vw;
            }
        `,
    ],
    template: `
        <div class="legend-pickrate-chart-container">
            <canvas #chartRef></canvas>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegendPickrateChartComponent implements AfterViewInit, OnChanges {
    @Input() public matchList: MatchDataStore[] = [];
    @Input() public legendList: Legend[] = [];

    private get chartOptions(): ChartOptions {
        return {
            responsive: true,
            interaction: {
                intersect: false,
            },
            layout: {
                padding: 20,
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    callbacks: {
                        label: (item) => `${item.label}: ${item.formattedValue}%`,
                    },
                    xAlign: "center",
                    yAlign: "center",
                },
                datalabels: {
                    display: "auto",
                    color: getCSSVar("--bs-white"),
                    anchor: "end",
                    align: "end",
                    formatter: (value, context) => {
                        const labels = context.chart.data.labels ?? [];
                        return labels[context.dataIndex];
                    },
                },
            },
            maintainAspectRatio: false,
        };
    }

    @ViewChild("chartRef") public chartRef?: ElementRef<HTMLCanvasElement>;
    private chart?: Chart;

    private dataLabels: string[] = [];
    private datasets: ChartDataset[] = [];

    constructor() {
        Chart.register(ArcElement, PieController, CategoryScale, LinearScale, ChartLegend, Tooltip);
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
            type: "pie",
            plugins: [ChartDataLabels],
            data: {
                labels: this.dataLabels,
                datasets: this.datasets,
            },
            options: this.chartOptions,
        });
    }

    private loadChartData(): void {
        if (isEmpty(this.matchList)) return;
        const legendPickrates: number[] = [];
        const groupedAvgMatchList = matchListAvgStatsGroupedBy(this.matchList, (m) => m.legendId);
        const numTotalMatches = this.matchList.length;
        this.dataLabels = [];

        for (const avgMatchList of groupedAvgMatchList) {
            const legendName = Legend.getName(avgMatchList.key);
            if (isEmpty(legendName)) continue;
            this.dataLabels.push(legendName!.toUpperCase());

            const legendPickrate = Number(((avgMatchList.numMatches / numTotalMatches) * 100).toFixed(0));
            legendPickrates.push(legendPickrate);
        }

        this.datasets = [
            {
                data: legendPickrates,
                backgroundColor: [
                    getCSSVar("--bs-blue"),
                    getCSSVar("--bs-red"),
                    getCSSVar("--bs-green"),
                    getCSSVar("--bs-orange"),
                    getCSSVar("--bs-purple"),
                    getCSSVar("--bs-cyan"),
                    getCSSVar("--bs-pink"),
                    getCSSVar("--bs-yellow"),
                ],
            },
        ];
    }
}

function getCSSVar(name: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name);
}
