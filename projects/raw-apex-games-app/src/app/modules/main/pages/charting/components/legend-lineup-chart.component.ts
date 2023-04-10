import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, ViewChild } from "@angular/core";
import { Legend } from "@raw-apex-games-app/app/common/legend/legend";
import { matchListAvgStatsGroupedBy } from "@raw-apex-games-app/app/common/utilities/match-stats";
import { MatchDataStore } from "@raw-apex-games-app/app/modules/core/local-database/match-data-store";
import {
    BarController,
    BarElement,
    CategoryScale,
    Chart,
    ChartDataset,
    Legend as ChartLegend,
    ChartOptions,
    LinearScale,
    Tooltip,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { isEmpty } from "common/utilities/";
import { ChartDamageCSSPropertyVar, ChartKillsCSSPropertyVar, ChartPlacementCSSPropertyVar } from "./chart";

@Component({
    selector: "app-legend-lineup-chart",
    styles: [
        `
            .legend-lineup-chart-container {
                height: 20vw;
            }
        `,
    ],
    template: `
        <div class="legend-lineup-chart-container">
            <canvas #chartRef></canvas>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegendLineupChartComponent implements AfterViewInit, OnChanges {
    @Input() public matchList: MatchDataStore[] = [];
    @Input() public legendList: Legend[] = [];

    private get chartOptions(): ChartOptions {
        return {
            responsive: true,
            elements: {
                bar: {},
            },
            interaction: {
                intersect: false,
            },
            plugins: {
                tooltip: {
                    xAlign: "center",
                    yAlign: "center",
                },
            },
            scales: {
                x: {
                    axis: "x",
                },
                yKills: {
                    axis: "y",
                    type: "linear",
                    display: false,
                    grace: "20%",
                },
                yDamage: {
                    axis: "y",
                    type: "linear",
                    display: false,
                    grace: "20%",
                },
                yPlacement: {
                    axis: "y",
                    type: "linear",
                    reverse: true,
                    display: false,
                    grace: "20%",
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
        Chart.register(BarElement, BarController, CategoryScale, LinearScale, ChartLegend, Tooltip);
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
            type: "bar",
            data: {
                labels: this.dataLabels,
                datasets: this.datasets,
            },
            options: this.chartOptions,
        });
    }

    private loadChartData(): void {
        if (isEmpty(this.matchList)) return;
        const killDeathRatioData: number[] = [];
        const placementData: number[] = [];
        const damageData: number[] = [];

        const groupedAvgMatchList = matchListAvgStatsGroupedBy(this.matchList, (m) => m.legendId);

        this.dataLabels = [];

        for (const avgMatchList of groupedAvgMatchList) {
            const legendName = Legend.getName(avgMatchList.key);
            if (isEmpty(legendName)) continue;
            this.dataLabels.push(legendName!.toUpperCase());
            killDeathRatioData.push(Number((avgMatchList.avgEliminations ?? 0).toFixed(2)));
            placementData.push(Number((avgMatchList.avgPlacement ?? 0).toFixed(0)));
            damageData.push(Number((avgMatchList?.avgDamage ?? 0).toFixed(0)));
        }

        this.datasets = [
            {
                data: killDeathRatioData,
                hidden: false,
                label: "Avg Kills",
                yAxisID: "yKills",
                backgroundColor: getCSSVar(ChartKillsCSSPropertyVar),
            },
            {
                data: damageData,
                hidden: false,
                label: "Avg Damage",
                yAxisID: "yDamage",
                backgroundColor: getCSSVar(ChartDamageCSSPropertyVar),
            },
            {
                data: placementData,
                hidden: true,
                label: "Avg Placement",
                yAxisID: "yPlacement",
                backgroundColor: getCSSVar(ChartPlacementCSSPropertyVar),
            },
        ];
    }
}

function getCSSVar(name: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name);
}
