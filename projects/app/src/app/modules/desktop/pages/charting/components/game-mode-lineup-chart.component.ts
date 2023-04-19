import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, ViewChild } from "@angular/core";
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
import { isEmpty } from "../../../../../../../../../common/utilities/";
import { MatchGameMode } from "../../../../../common/match/game-mode/game-mode";
import { matchListAvgStatsGroupedBy } from "../../../../../common/utilities/match-stats";
import { MatchDataStore } from "../../../../../modules/core/local-database/match-data-store";
import { ChartDamageCSSPropertyVar, ChartKillsCSSPropertyVar, ChartPlacementCSSPropertyVar } from "./chart";

@Component({
    selector: "app-game-mode-lineup-chart",
    styles: [
        `
            .game-mode-lineup-chart-container {
                height: 20vw;
            }
        `,
    ],
    template: `
        <div class="game-mode-lineup-chart-container">
            <canvas #chartRef></canvas>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameModeLineupChartComponent implements AfterViewInit, OnChanges {
    @Input() public matchList: MatchDataStore[] = [];
    @Input() public gameModeList: MatchGameMode[] = [];

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

        const groupedAvgMatchList = matchListAvgStatsGroupedBy(this.matchList, (m) => m.gameModeId);

        this.dataLabels = [];

        for (const avgMatchList of groupedAvgMatchList) {
            const gameMode = this.gameModeList.find((gm) => gm.gameModeId === avgMatchList.key);
            if (isEmpty(gameMode)) continue;
            const gameModeName = MatchGameMode.getFromId(this.gameModeList, gameMode!.gameModeId);

            this.dataLabels.push(gameModeName.gameModeName.toUpperCase());

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
