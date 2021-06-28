import { matchListAvgStatsGroupedBy, matchStatBounds } from "@allfather-app/app/common/utilities/match-stats";
import { MatchDataStore } from "@allfather-app/app/modules/core/local-database/match-data-store";
import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, ViewChild } from "@angular/core";
import {
    ArcElement,
    BarController,
    BarElement,
    BubbleController,
    CategoryScale,
    Chart,
    ChartDataset,
    ChartOptions,
    DoughnutController,
    Filler,
    Legend,
    LinearScale,
    LineController,
    LineElement,
    LogarithmicScale,
    PieController,
    PointElement,
    PolarAreaController,
    RadarController,
    RadialLinearScale,
    ScatterController,
    TimeScale,
    TimeSeriesScale,
    Title,
    Tooltip,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { format, subDays } from "date-fns";
import { isEmpty } from "shared/utilities";

Chart.register(
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Filler,
    Legend,
    Title,
    Tooltip
);

@Component({
    selector: "app-line-graph",
    templateUrl: "./line-graph.component.html",
    styleUrls: ["./line-graph.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineGraphComponent implements OnChanges {
    @Input() public matchList: MatchDataStore[] = [];

    private dateKeyFormat = "MMM dd";
    private chartOptions: ChartOptions = {
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
                time: {
                    unit: "day",
                    displayFormats: {
                        day: this.dateKeyFormat,
                    },
                },
            },
            y: {
                axis: "y",
                type: "linear",
                display: false,
                grace: "20%",
            },
            yPlacement: {
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
        },
    };

    @ViewChild("chartRef") public chartRef?: ElementRef<HTMLCanvasElement>;
    private numDaysToShow = 14;
    private dataLabels: string[] = [];
    private datasets: ChartDataset[] = [];

    constructor() {}

    public ngOnChanges(): void {
        this.loadChartData();
        this.drawGraph();
    }

    private drawGraph(): void {
        if (!this.chartRef?.nativeElement) return;
        new Chart(this.chartRef?.nativeElement, {
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
        const now = new Date();
        const eliminationData: number[] = [];
        const knockdownData: number[] = [];
        const placementScoreData: number[] = [];
        const damageData: number[] = [];

        const recentStartDate = subDays(now, this.numDaysToShow);
        const recentMatchList = this.matchList.filter((match) => (match.endDate ?? 0) > recentStartDate);
        const groupedAvgMatchList = matchListAvgStatsGroupedBy(recentMatchList, (m) => format(m.endDate!, this.dateKeyFormat));

        const { placementMin } = matchStatBounds(this.matchList);

        for (let i = this.numDaysToShow - 1; i >= 0; i--) {
            const labelDate = subDays(now, i);
            const formattedLabelDate = format(labelDate, this.dateKeyFormat);
            this.dataLabels.push(formattedLabelDate);

            const avgMatchDay = groupedAvgMatchList.find((m) => m.key == formattedLabelDate);
            eliminationData.push(Number((avgMatchDay?.avgEliminations ?? 0).toFixed(2)));
            knockdownData.push(Number((avgMatchDay?.avgKnockdowns ?? 0).toFixed(2)));
            damageData.push(Number((avgMatchDay?.avgDamage ?? 0).toFixed(0)));

            const placementScore = avgMatchDay?.avgPlacement;
            placementScoreData.push(Number((placementScore ?? 0).toFixed(0)));
        }

        this.datasets = [
            { data: eliminationData, label: "Avg Kills", yAxisID: "y", backgroundColor: getCSSVar("--bs-red") },
            { data: knockdownData, label: "Avg Knocks", yAxisID: "y", backgroundColor: getCSSVar("--bs-cyan") },
            { data: placementScoreData, label: "Avg Placement", yAxisID: "yPlacement", backgroundColor: getCSSVar("--bs-yellow") },
            { data: damageData, label: "Avg Damage", yAxisID: "yDamage", backgroundColor: getCSSVar("--bs-green") },
        ];
    }
}

function getCSSVar(name: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name);
}
