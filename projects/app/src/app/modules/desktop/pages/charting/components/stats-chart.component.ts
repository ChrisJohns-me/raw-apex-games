import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, ViewChild } from "@angular/core";
import { matchListAvgStatsGroupedBy } from "@app/app/common/utilities/match-stats";
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
} from "chart.js";
import "chartjs-adapter-date-fns";
import { isEmpty } from "common/utilities/";
import { format, getDaysInYear, subDays } from "date-fns";
import { ChartDamageCSSPropertyVar, ChartKillsCSSPropertyVar, ChartPlacementCSSPropertyVar } from "./chart";

@Component({
    selector: "app-stats-chart",
    styles: [
        `
            .stats-chart-container {
                height: 20vw;
            }
        `,
    ],
    template: `
        <div class="stats-chart-container">
            <canvas #chartRef></canvas>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsChartComponent implements AfterViewInit, OnChanges {
    @Input() public matchList: MatchDataStore[] = [];
    @Input() public unit: "hour" | "day" | "month" | "quarter" | "year" = "day";

    private get dateKeyFormat(): string {
        switch (this.unit) {
            case "hour":
                return "h:mm a";
            case "month":
                return "MMMM";
            case "quarter":
                return "QQQQ";
            case "year":
                return "yyyy";
            case "day":
            default:
                return "MMM dd";
        }
    }
    private get chartOptions(): ChartOptions {
        return {
            responsive: true,
            elements: {
                line: {
                    tension: 0.33,
                },
            },
            interaction: {
                intersect: true,
            },
            plugins: {
                tooltip: {
                    xAlign: "center",
                    yAlign: "top",
                },
            },
            scales: {
                x: {
                    axis: "x",
                    time: {
                        unit: this.unit,
                        displayFormats: {
                            day: this.dateKeyFormat,
                        },
                    },
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
    private get numDaysToShow(): number {
        switch (this.unit) {
            case "hour":
                return 1;
            case "month":
                return getDaysInYear(new Date());
            case "quarter":
                return getDaysInYear(new Date()) / 4;
            case "year":
                return getDaysInYear(new Date()) * 5;
            case "day":
            default:
                return 14;
        }
    }
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
        const now = new Date();
        const killDeathRatioData: number[] = [];
        const placementData: number[] = [];
        const damageData: number[] = [];

        const matchList = this.matchList
            .slice()
            .sort((a, b) => (a.startDate?.getTime() ?? Infinity) - (b.startDate?.getTime() ?? Infinity));
        const recentStartDate = subDays(now, this.numDaysToShow);
        const recentMatchList = matchList.filter((match) => (match.endDate ?? 0) > recentStartDate);
        const groupedAvgMatchList = matchListAvgStatsGroupedBy(recentMatchList, (m) => format(m.endDate!, this.dateKeyFormat));

        this.dataLabels = [];

        for (const avgMatchList of groupedAvgMatchList) {
            this.dataLabels.push(avgMatchList.key);
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
                borderColor: getCSSVar(ChartKillsCSSPropertyVar),
                backgroundColor: getCSSVar(ChartKillsCSSPropertyVar),
                cubicInterpolationMode: "monotone",
            },
            {
                data: damageData,
                hidden: false,
                label: "Avg Damage",
                yAxisID: "yDamage",
                borderColor: getCSSVar(ChartDamageCSSPropertyVar),
                backgroundColor: getCSSVar(ChartDamageCSSPropertyVar),
                cubicInterpolationMode: "monotone",
            },
            {
                data: placementData,
                hidden: true,
                label: "Avg Placement",
                yAxisID: "yPlacement",
                borderColor: getCSSVar(ChartPlacementCSSPropertyVar),
                backgroundColor: getCSSVar(ChartPlacementCSSPropertyVar),
                cubicInterpolationMode: "monotone",
            },
        ];
    }
}

function getCSSVar(name: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name);
}
