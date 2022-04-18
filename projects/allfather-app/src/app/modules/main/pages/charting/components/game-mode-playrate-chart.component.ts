import { MatchGameMode } from "@allfather-app/app/common/match/game-mode/game-mode";
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
    selector: "app-game-mode-playrate-chart",
    styles: [
        `
            .game-mode-playrate-chart-container {
                height: 20vw;
            }
        `,
    ],
    template: `
        <div class="game-mode-playrate-chart-container">
            <canvas #chartRef></canvas>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameModePlayrateChartComponent implements AfterViewInit, OnChanges {
    @Input() public matchList: MatchDataStore[] = [];
    @Input() public gameModeList: MatchGameMode[] = [];

    private get chartOptions(): ChartOptions {
        return {
            responsive: true,
            interaction: {
                intersect: false,
            },
            layout: {
                padding: 40,
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
                        return `${labels[context.dataIndex]}: ${value}%`;
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
        const gameModePlayrates: number[] = [];
        const groupedAvgMatchList = matchListAvgStatsGroupedBy(this.matchList, (m) => m.gameModeId);
        const numTotalMatches = this.matchList.length;
        this.dataLabels = [];

        for (const avgMatchList of groupedAvgMatchList) {
            const gameMode = this.gameModeList.find((gm) => gm.gameModeId === avgMatchList.key);
            if (isEmpty(gameMode)) continue;
            const gameModeName = MatchGameMode.getFromId(this.gameModeList, gameMode!.gameModeId);

            this.dataLabels.push(gameModeName.gameModeName.toUpperCase());

            const gameModePlayrate = Number(((avgMatchList.numMatches / numTotalMatches) * 100).toFixed(0));
            gameModePlayrates.push(gameModePlayrate);
        }

        this.datasets = [
            {
                data: gameModePlayrates,
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
